const display = document.getElementById('display');
const current = document.getElementById('current');
const history = document.getElementById('history');

let state = {
  current: '0',
  prev: null,
  op: null,
  justCalc: false
};

function updateDisplay() {
  const val = state.current;
  current.textContent = formatNum(val);
  current.className = 'current';
  if (val.length > 12) current.classList.add('tiny');
  else if (val.length > 8) current.classList.add('small');
}

function formatNum(s) {
  if (s === 'Ошибка') return s;
  const parts = s.split('.');
  const neg = parts[0].startsWith('-') ? '-' : '';
  const intPart = parts[0].replace('-', '');
  const formatted = parseInt(intPart).toLocaleString('ru-RU');
  return neg + (parts.length > 1 ? formatted + '.' + parts[1] : formatted);
}

function ripple(btn, e) {
  const r = document.createElement('span');
  r.className = 'ripple';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
}

function pressAnim(btn) {
  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 120);
}

function shakeDisplay() {
  display.classList.remove('shake');
  void display.offsetWidth;
  display.classList.add('shake');
}

function flashResult() {
  current.classList.remove('flash');
  void current.offsetWidth;
  current.classList.add('flash');
}

function toNum(s) {
  return parseFloat(s.replace(/\s/g, ''));
}

function calculate(a, op, b) {
  const x = toNum(a), y = toNum(b);
  if (op === '÷') { if (y === 0) return null; return x / y; }
  if (op === '×') return x * y;
  if (op === '−') return x - y;
  if (op === '+') return x + y;
  return y;
}

function handleAction(action, extra) {
  if (action === 'num') {
    if (state.justCalc) { state.current = extra; state.justCalc = false; }
    else if (state.current === '0') state.current = extra;
    else if (state.current.length < 14) state.current += extra;
  }

  else if (action === 'decimal') {
    if (state.justCalc) { state.current = '0.'; state.justCalc = false; return; }
    if (!state.current.includes('.')) state.current += '.';
  }

  else if (action === 'clear') {
    state = { current: '0', prev: null, op: null, justCalc: false };
    history.textContent = '';
  }

  else if (action === 'ce') {
    state.current = '0';
    state.justCalc = false;
  }

  else if (action === 'percent') {
    const n = toNum(state.current);
    state.current = state.prev && state.op
      ? String(toNum(state.prev) * n / 100)
      : String(n / 100);
    state.justCalc = false;
  }

  else if (action === 'toggle-sign') {
    if (state.current !== '0') {
      state.current = state.current.startsWith('-')
        ? state.current.slice(1)
        : '-' + state.current;
    }
  }

  else if (action === 'op') {
    if (state.op && !state.justCalc) {
      const res = calculate(state.prev, state.op, state.current);
      if (res === null) {
        state.current = 'Ошибка';
        shakeDisplay();
        updateDisplay();
        return;
      }
      state.prev = String(res);
      state.current = String(res);
    } else {
      state.prev = state.current;
    }
    state.op = extra;
    state.justCalc = false;
    history.textContent = formatNum(state.prev) + ' ' + extra;
  }

  else if (action === 'equals') {
    if (!state.op || state.prev === null) return;
    const res = calculate(state.prev, state.op, state.current);
    if (res === null) {
      state.current = 'Ошибка';
      history.textContent = formatNum(state.prev) + ' ' + state.op + ' ' + formatNum(state.current) + ' =';
      shakeDisplay();
      updateDisplay();
      return;
    }
    history.textContent = formatNum(state.prev) + ' ' + state.op + ' ' + formatNum(state.current) + ' =';
    state.current = String(parseFloat(res.toPrecision(12)));
    state.prev = null;
    state.op = null;
    state.justCalc = true;
    flashResult();
  }

  updateDisplay();
}

// Обработка кликов
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    ripple(btn, e);
    pressAnim(btn);
    const action = btn.dataset.action;
    const extra = btn.dataset.op || btn.dataset.num;
    handleAction(action, extra);
  });
});

// Поддержка клавиатуры
document.addEventListener('keydown', e => {
  const map = {
    '0':'num:0','1':'num:1','2':'num:2','3':'num:3','4':'num:4',
    '5':'num:5','6':'num:6','7':'num:7','8':'num:8','9':'num:9',
    '.':'decimal',',':'decimal',
    '+':'op:+','-':'op:−','*':'op:×','/':'op:÷',
    'Enter':'equals','=':'equals',
    'Backspace':'ce','Escape':'clear','%':'percent'
  };
  const cmd = map[e.key];
  if (!cmd) return;
  e.preventDefault();
  const [action, extra] = cmd.split(':');
  handleAction(action, extra);

  const sel = action === 'num' ? `[data-num="${extra}"]`
    : action === 'op' ? `[data-op="${extra}"]`
    : `[data-action="${action}"]`;
  const btn = document.querySelector(sel);
  if (btn) pressAnim(btn);
});

updateDisplay();

# Калькулятор — статический сайт

Современный онлайн-калькулятор в тёмном стиле. Готов к деплою на GitHub Pages, Cloudflare Pages или Netlify.

## Файлы

- `index.html` — весь сайт в одном файле (HTML + CSS + JS)

## Деплой на GitHub Pages

1. Создай репозиторий на github.com
2. Загрузи файлы:
   ```bash
   git init
   git add .
   git commit -m "init calculator"
   git remote add origin https://github.com/ВАШ-ЛОГИН/calculator.git
   git push -u origin main
   ```
3. Зайди в Settings → Pages → Source: `main` / `root`
4. Сайт будет доступен по адресу: `https://ВАШ-ЛОГИН.github.io/calculator`

## Возможности калькулятора

- Базовые операции: +, −, ×, ÷
- Процент, смена знака ±
- История выражения
- Поддержка клавиатуры
- Ripple-эффекты и анимации
- Адаптивный дисплей (уменьшает шрифт при длинных числах)
- Обработка ошибок (деление на ноль)

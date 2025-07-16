# Менеджер задач (Task Manager)


## Технологии
- React + TypeScript
- Vite
- React Router v6
- Zustand (или другой state-менеджер)
- CSS Modules
- ESLint + Prettier
- Autoprefixer + PostCSS

## Архитектура
Проект структурирован по принципам Feature-Sliced Design:
- `src/entities` — бизнес-сущности (например, Task)
- `src/features` — пользовательские фичи (например, Task CRUD)
- `src/shared` — переиспользуемые компоненты, утилиты, стили
- `src/pages` — страницы приложения
- `src/widgets` — крупные UI-блоки
- `src/app` — инициализация приложения, роутинг

## Запуск проекта

```bash
npm install
npm run dev
```



-
https://task-manager-59nw.vercel.app/ Клик

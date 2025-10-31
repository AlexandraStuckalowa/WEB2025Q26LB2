// Создаем основу
const app = document.createElement('div');
app.className = 'app';

// Добавляем ее на страницу
document.body.appendChild(app);

// Создаём заголовок
const title = document.createElement('h1');
title.textContent = 'Мой список дел';
app.appendChild(title);

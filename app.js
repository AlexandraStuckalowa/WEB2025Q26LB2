// Создаем основу
const app = document.createElement('div');
app.className = 'app';

// Добавляем ее на страницу
document.body.appendChild(app);

// Создаём заголовок
const title = document.createElement('h1');
title.textContent = 'Мой список дел';
app.appendChild(title);

// Создаём форму для добавления задач
const form = document.createElement('form');
form.className = 'task-form';

// Создаем поле для ввода текста задачи
const inputText = document.createElement('input');
inputText.type = 'text';
inputText.placeholder = 'Введите задачу...';
inputText.required = true;

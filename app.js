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

// Поле для выбора даты
const inputDate = document.createElement('input');
inputDate.type = 'date';

// Добавляем кнопку для создания задачи
const addButton = document.createElement('button');
addButton.type = 'submit';
addButton.textContent = 'Добавить';

// Добавляем все внутрь формы
form.append(inputText, inputDate, addButton);

// Вставляем форму на страницу
app.appendChild(form);

// Добавляем основу для списка задач
const taskList = document.createElement('ul');
taskList.className = 'task-list';

// Добавляем основу на сайт
app.appendChild(taskList);

// Добавляем обработчик отправки формы
form.addEventListener('submit', (e) => {
  e.preventDefault(); // не перезагружать страницу
});


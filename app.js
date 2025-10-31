// Как выглядит выполненная задача
const styleCompleted = document.createElement('style');
styleCompleted.textContent = `
  .task-item.completed .task-title {
    text-decoration: line-through;
    opacity: 0.6;
  }
`;
document.head.appendChild(styleCompleted);

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

// В обработчике: подготовка данных из формы
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = inputText.value.trim();
  const due = inputDate.value || null;

  if (!title) {
    // пустая задача не добавляется
    return;
  }
  // создаём элемент задачи и добавляем в список
  const li = document.createElement('li');
  li.className = 'task-item';

  const spanTitle = document.createElement('span');
  spanTitle.className = 'task-title';
  spanTitle.textContent = title;

  // дата (если указана)
  if (due) {
    const spanDate = document.createElement('span');
    spanDate.className = 'task-date';
    spanDate.textContent = due;
    li.appendChild(spanDate);
  }

  li.appendChild(spanTitle);

// Кнопка для удаления задачи
const deleteButton = document.createElement('button');
deleteButton.className = 'delete-btn';
deleteButton.textContent = 'Удалить';
li.appendChild(deleteButton);

// Кнопка для отметки выполнения задачи
const doneButton = document.createElement('button');
doneButton.className = 'done-btn';
doneButton.textContent = '✔';
li.appendChild(doneButton);

// В обработчике отметить задачу как выполненную
doneButton.addEventListener('click', () => {
  li.classList.toggle('completed');
});


// Обработчик на кнопку удаления
deleteButton.addEventListener('click', () => {
  li.remove();
});

taskList.appendChild(li);


  // очистка полей формы
  inputText.value = '';
  inputDate.value = '';
});


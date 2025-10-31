// Как выглядит выполненная задача (серая и зачеркнута)
const styleCompleted = document.createElement('style');
styleCompleted.textContent = `
  .task-item.completed .task-title {
    text-decoration: line-through;
    opacity: 0.6;
  }
`;
document.head.appendChild(styleCompleted);

// Как выглядит  базовая раскладка списка и кнопок
const styleBase = document.createElement('style');
styleBase.textContent = `
  .app { max-width: 760px; margin: 24px auto; font-family: system-ui, Arial, sans-serif; }
  .task-form { display: grid; grid-template-columns: 1fr 160px auto; gap: 8px; margin: 12px 0; }
  .task-list { list-style: none; padding: 0; margin: 12px 0; display: grid; gap: 8px; }
  .task-item { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; flex-wrap: wrap; }
  .task-date { text-align: right; }

  .delete-btn, .done-btn { padding: 6px 10px; border-radius: 6px; border: 1px solid #ccc; background: #f5f5f5; cursor: pointer; width: auto; display: inline-block; text-align: center; min-width: 32px; }
  .edit-btn { padding: 6px 10px; border-radius: 6px; border: 1px solid #ccc; background: #f5f5f5; cursor: pointer; }

`;
document.head.appendChild(styleBase);

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

  li.appendChild(spanTitle);

  if (due) {
  const spanDate = document.createElement('span');
  spanDate.className = 'task-date';
  spanDate.textContent = due;
  li.appendChild(spanDate);
}
// Кнопка для удаления задачи
const deleteButton = document.createElement('button');
deleteButton.className = 'delete-btn';
deleteButton.textContent = 'Удалить';
li.appendChild(deleteButton);

// Кнопка для отметки выполнения задачи
const doneButton = document.createElement('button');
doneButton.className = 'done-btn';
doneButton.textContent = 'Выполнено';
li.appendChild(doneButton);

// Кнопка редактирования
const editButton = document.createElement('button');
editButton.className = 'edit-btn';
editButton.textContent = 'Редактировать';
li.appendChild(editButton);

// Заготовка: переключение режима редактирования
let isEditing = false;
editButton.addEventListener('click', () => {
  isEditing = !isEditing;
  editButton.textContent = isEditing ? 'Сохранить' : 'Редактировать';
});


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


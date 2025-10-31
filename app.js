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
  .controls { display: flex; gap: 8px; margin: 8px 0 12px; }
  .controls .search, .controls select { padding: 8px; border: 1px solid #ddd; border-radius: 6px; }
  .controls .search { flex: 1; }

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

// Панель управления списком
const controls = document.createElement('div');
controls.className = 'controls';
app.appendChild(controls);

// Поиск по названию
const searchInput = document.createElement('input');
searchInput.type = 'search';
searchInput.placeholder = 'Поиск по названию...';
searchInput.className = 'search';
controls.appendChild(searchInput);

// Фильтр по статусу
const statusFilter = document.createElement('select');
statusFilter.className = 'status-filter';
statusFilter.innerHTML = `
  <option value="all">Все</option>
  <option value="active">Невыполнено</option>
  <option value="done">Выполнено</option>
`;
controls.appendChild(statusFilter);

// Сортировка по дате
const sortSelect = document.createElement('select');
sortSelect.className = 'date-sort';
sortSelect.innerHTML = `
  <option value="none">Без сортировки</option>
  <option value="asc">По дате ↑</option>
  <option value="desc">По дате ↓</option>
`;
controls.appendChild(sortSelect);

// Добавляем основу для списка задач
const taskList = document.createElement('ul');
taskList.className = 'task-list';

// Добавляем основу на сайт
app.appendChild(taskList);

// Добавляем обработчик отправки формы
form.addEventListener('submit', (e) => {
  e.preventDefault(); 
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

  // Данные для сортировки
li.dataset.status = 'active';   
li.dataset.date = due || '';          


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

// Редактирование текста и даты
let isEditing = false;
editButton.addEventListener('click', () => {
  if (!isEditing) {
    // включить режим редактирования
    isEditing = true;
    editButton.textContent = 'Сохранить';

    // существующие элементы
    const titleSpan = li.querySelector('.task-title');
    let dateSpan = li.querySelector('.task-date');

    // поля ввода 
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = titleSpan.textContent;
    titleInput.className = 'edit-title';

    // если даты не было - создадим пустое поле
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = dateSpan ? dateSpan.textContent : '';

    // подменяем элементы в DOM
    li.replaceChild(titleInput, titleSpan);

    if (dateSpan) {
      li.replaceChild(dateInput, dateSpan);
    } else {
      // вставим поле даты сразу после заголовка
      li.insertBefore(dateInput, deleteButton);
    }

  } else {
    // сохраняем изменения
    isEditing = false;
    editButton.textContent = 'Редактировать';

    // находим поля ввода
    const titleInput = li.querySelector('.edit-title') || li.querySelector('input[type="text"]');
    const dateInput = li.querySelector('input[type="date"]');

    const newTitle = (titleInput?.value || '').trim();
    const newDate = dateInput?.value || '';

    // создаём или восстанавливаем спаны
    const newTitleSpan = document.createElement('span');
    newTitleSpan.className = 'task-title';
    newTitleSpan.textContent = newTitle || '(без названия)';

    let dateSpan = li.querySelector('.task-date');

    // если есть дата, то спан должен быть. Если пусто, то удаляем или не создаём
    if (newDate) {
      if (!dateSpan) {
        dateSpan = document.createElement('span');
        dateSpan.className = 'task-date';
        // вставим перед кнопками, чтобы сохранить порядок
        li.insertBefore(dateSpan, deleteButton);
      }
      dateSpan.textContent = newDate;
    } else if (dateSpan) {
      dateSpan.remove();
    }

    // заменяем поле ввода заголовка обратно на спан
    if (titleInput) {
      li.replaceChild(newTitleSpan, titleInput);
    }
  }
});

// В обработчике отметить задачу как выполненную
doneButton.addEventListener('click', () => {
  li.classList.toggle('completed');
  li.dataset.status = li.classList.contains('completed') ? 'done' : 'active';
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

// Фильтрация по поиску
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  [...taskList.children].forEach(li => {
    const title = (li.querySelector('.task-title')?.textContent || '').toLowerCase();
    li.style.display = title.includes(q) ? '' : 'none';
  });
});

//Фильтрация по статусу
statusFilter.addEventListener('change', () => {
  const need = statusFilter.value; // all|active|done
  [...taskList.children].forEach(li => {
    const st = li.dataset.status || 'active';
    li.style.display = (need === 'all' || st === need) ? '' : 'none';
  });
});

//Сортировка по дате
sortSelect.addEventListener('change', () => {
  const mode = sortSelect.value; // none|asc|desc
  const items = [...taskList.children];

  if (mode === 'none') return;

  items.sort((a, b) => {
    const da = a.dataset.date || '';
    const db = b.dataset.date || '';
    // пустые даты отправляем в конец при asc, в начало при desc
    if (!da && !db) return 0;
    if (!da) return mode === 'asc' ? 1 : -1;
    if (!db) return mode === 'asc' ? -1 : 1;
    return mode === 'asc' ? da.localeCompare(db) : db.localeCompare(da);
  });

  // изменяем порядок
  items.forEach(el => taskList.appendChild(el));
});

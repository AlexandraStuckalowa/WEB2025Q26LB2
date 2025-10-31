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
  .task-item { user-select: none; }
  .task-item.dragging { opacity: .6; }
  .task-item.drop-target { outline: 2px dashed #999; }

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

//функция создания одной задачи
function addTask({ title, due = '', completed = false }) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.draggable = true;
  li.dataset.status = completed ? 'done' : 'active';
  li.dataset.date = due || '';

  //заголовок
  const spanTitle = document.createElement('span');
  spanTitle.className = 'task-title';
  spanTitle.textContent = title;
  li.appendChild(spanTitle);

  //если есть дата 
  if (due) {
    const spanDate = document.createElement('span');
    spanDate.className = 'task-date';
    spanDate.textContent = due;
    li.appendChild(spanDate);
  }

  // кнопки
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-btn';
  deleteButton.textContent = 'Удалить';
  li.appendChild(deleteButton);

  const doneButton = document.createElement('button');
  doneButton.className = 'done-btn';
  doneButton.textContent = 'Выполнено';
  li.appendChild(doneButton);

  const editButton = document.createElement('button');
  editButton.className = 'edit-btn';
  editButton.textContent = 'Редактировать';
  li.appendChild(editButton);

  //отметка выполнено
  doneButton.addEventListener('click', () => {
    li.classList.toggle('completed');
    li.dataset.status = li.classList.contains('completed') ? 'done' : 'active';
    saveState();
  });

  //удаление
  deleteButton.addEventListener('click', () => {
    li.remove();
    saveState();
  });

  let isEditing = false;
  editButton.addEventListener('click', () => {
    if (!isEditing) {
      isEditing = true;
      editButton.textContent = 'Сохранить';

      const titleSpan = li.querySelector('.task-title');
      let dateSpan = li.querySelector('.task-date');

      const titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.value = titleSpan.textContent;
      titleInput.className = 'edit-title';

      const dateInput = document.createElement('input');
      dateInput.type = 'date';
      dateInput.value = dateSpan ? dateSpan.textContent : '';

      li.replaceChild(titleInput, titleSpan);
      if (dateSpan) {
        li.replaceChild(dateInput, dateSpan);
      } else {
        li.insertBefore(dateInput, deleteButton);
      }
    } else {
      isEditing = false;
      editButton.textContent = 'Редактировать';

      const titleInput = li.querySelector('.edit-title') || li.querySelector('input[type="text"]');
      const dateInput = li.querySelector('input[type="date"]');

      const newTitle = (titleInput?.value || '').trim();
      const newDate  = dateInput?.value || '';

      const newTitleSpan = document.createElement('span');
      newTitleSpan.className = 'task-title';
      newTitleSpan.textContent = newTitle || '(без названия)';

      let dateSpan = li.querySelector('.task-date');

      if (newDate) {
        if (!dateSpan) {
          dateSpan = document.createElement('span');
          dateSpan.className = 'task-date';
          li.insertBefore(dateSpan, deleteButton);
        }
        dateSpan.textContent = newDate;
        if (dateInput && dateSpan.parentNode) {
          li.replaceChild(dateSpan, dateInput);
        }
      } else {
        if (dateSpan) dateSpan.remove();
        if (dateInput) dateInput.remove();
      }

      if (titleInput) {
        li.replaceChild(newTitleSpan, titleInput);
      }

      // обновим дату и сохраним
      li.dataset.date = newDate || '';
      saveState();
    }
  });

  if (completed) li.classList.add('completed');

  taskList.appendChild(li);
  return li;
}

// В обработчике: подготовка данных из формы
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = inputText.value.trim();
  const due = inputDate.value || '';
  if (!title) return;

  addTask({ title, due, completed: false }); //создаём задачу через функцию

  inputText.value = '';
  inputDate.value = '';

  saveState(); //сразу сохраняем
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

//LocalStorage
const STORAGE_KEY = 'todo-tasks';

function saveState() {
  const data = [...taskList.children].map(li => ({
    title: li.querySelector('.task-title')?.textContent || '',
    due:   li.dataset.date || '',
    completed: li.dataset.status === 'done'
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const list = JSON.parse(raw);
    if (Array.isArray(list)) {
      list.forEach(t => addTask(t));
    }
  } catch (e) {
    console.warn('Не удалось загрузить задачи из localStorage', e);
  }
}

// загрузка при старте
loadState();

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/store';
import type { AppDispatch } from '@/app/store';
import { TaskItem } from '@/entities/task/ui/TaskItem';
import styles from './TaskList.module.css';
import { useState, useEffect } from 'react';
import type { Task, TaskPriority } from '@/entities/task/model/types';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchTasks } from '@/entities/task/model/taskApiSlice';

const sortOptions = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'priority', label: 'По приоритету' },
];

const statusOptions = [
  { value: '', label: 'Все статусы' },
  { value: 'To Do', label: 'To Do' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Done', label: 'Done' },
];
const categoryOptions = [
  { value: '', label: 'Все категории' },
  { value: 'Bug', label: 'Bug' },
  { value: 'Feature', label: 'Feature' },
  { value: 'Documentation', label: 'Documentation' },
  { value: 'Refactor', label: 'Refactor' },
  { value: 'Test', label: 'Test' },
];
const priorityOptions = [
  { value: '', label: 'Любой приоритет' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];
const dateOptions = [
  { value: '', label: 'Все даты' },
  { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'Последняя неделя' },
  { value: 'month', label: 'Последний месяц' },
];

/**
 * Сравнивает две задачи для сортировки
 * Поддерживает сортировку по дате создания и приоритету
 * 
 * @param {Task} a - Первая задача для сравнения
 * @param {Task} b - Вторая задача для сравнения
 * @param {string} sort - Тип сортировки ('newest' | 'oldest' | 'priority')
 * @returns {number} Результат сравнения для сортировки
 */
function compareTasks(a: Task, b: Task, sort: string) {
  if (sort === 'priority') {
    const order: Record<TaskPriority, number> = { High: 3, Medium: 2, Low: 1 };
    return order[b.priority] - order[a.priority];
  }
  const dateA = new Date(a.createdAt).getTime();
  const dateB = new Date(b.createdAt).getTime();
  return sort === 'oldest' ? dateA - dateB : dateB - dateA;
}

/**
 * Компонент для отображения списка задач
 * Включает функциональность поиска, фильтрации, сортировки и пагинации
 * Поддерживает асинхронную загрузку данных с индикаторами состояния
 * 
 * @component
 * @returns {JSX.Element} Список задач с панелью управления
 */

export function TaskList() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const [sort, setSort] = useState(sortOptions[0]);
  const [status, setStatus] = useState(statusOptions[0]);
  const [category, setCategory] = useState(categoryOptions[0]);
  const [priority, setPriority] = useState(priorityOptions[0]);
  const [date, setDate] = useState(dateOptions[0]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchDate, setSearchDate] = useState<Date | null>(null);

  const theme = document.body.getAttribute('data-theme') || 'dark';

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleClearSearch = () => {
    setSearchTitle('');
    setSearchDate(null);
  };

  const filtered = tasks.filter(task => {
    const titleMatch = !searchTitle || task.title.toLowerCase().includes(searchTitle.toLowerCase());
    
    const dateMatch = !searchDate || (() => {
      const taskDate = new Date(task.createdAt);
      const searchDateOnly = new Date(searchDate);
      return taskDate.toDateString() === searchDateOnly.toDateString();
    })();

    const statusMatch = !status.value || task.status === status.value;
    const categoryMatch = !category.value || task.category === category.value;
    const priorityMatch = !priority.value || task.priority === priority.value;
    
    let dateFilterMatch = true;
    if (date.value) {
      const created = new Date(task.createdAt);
      const now = new Date();
      if (date.value === 'today') {
        dateFilterMatch = created.toDateString() === now.toDateString();
      } else if (date.value === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        dateFilterMatch = created >= weekAgo && created <= now;
      } else if (date.value === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        dateFilterMatch = created >= monthAgo && created <= now;
      }
    }

    return titleMatch && dateMatch && statusMatch && categoryMatch && priorityMatch && dateFilterMatch;
  });

  const sorted = [...filtered].sort((a, b) => compareTasks(a, b, sort.value));

  if (loading) {
    return <div className={styles.empty}>Загрузка задач...</div>;
  }

  if (error) {
    return <div className={styles.empty}>Ошибка: {error}</div>;
  }

  if (!tasks.length) {
    return <div className={styles.empty}>Нет задач</div>;
  }

    return (
    <>
      <div className={styles.sortPanel} style={{ flexWrap: 'wrap', gap: 12, rowGap: 8, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            style={{
              padding: '8px 12px',
              border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#23243a'}`,
              borderRadius: 8,
              background: theme === 'light' ? '#f7f8fa' : '#23243a',
              color: theme === 'light' ? '#23243a' : '#fff',
              minWidth: 200,
            }}
          />
          <DatePicker
            selected={searchDate}
            onChange={(date) => setSearchDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Выберите дату"
            isClearable
            customInput={
              <input
                style={{
                  padding: '8px 12px',
                  border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#23243a'}`,
                  borderRadius: 8,
                  background: theme === 'light' ? '#f7f8fa' : '#23243a',
                  color: theme === 'light' ? '#23243a' : '#fff',
                  minWidth: 140,
                }}
              />
            }
          />

            {(searchTitle || searchDate) && (
              <button
                onClick={handleClearSearch}
                style={{
                  padding: '8px 16px',
                  background: theme === 'light' ? '#e74c3c' : '#c0392b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Очистить
              </button>
            )}
        </div>
      </div>

      <div className={styles.sortPanel} style={{ flexWrap: 'wrap', gap: 12, rowGap: 8 }}>
        <label style={{ marginRight: 8 }}>Сортировка:</label>
        <div style={{ minWidth: 180, marginRight: 12 }}>
          <Select
            value={sort}
            onChange={opt => opt && setSort(opt)}
            options={sortOptions}
            isSearchable={false}
            styles={{
              control: (base) => ({
                ...base,
                background: theme === 'light' ? '#f7f8fa' : '#23243a',
                borderColor: theme === 'light' ? '#e0e0e0' : '#23243a',
                color: theme === 'light' ? '#23243a' : '#fff',
                boxShadow: 'none',
                minHeight: 38,
                fontWeight: 500,
                fontSize: '1rem',
              }),
              singleValue: (base) => ({
                ...base,
                color: theme === 'light' ? '#23243a' : '#fff',
              }),
              menu: (base) => ({
                ...base,
                background: theme === 'light' ? '#fff' : '#23243a',
                color: theme === 'light' ? '#23243a' : '#fff',
                borderRadius: 8,
                boxShadow: '0 4px 16px #0002',
              }),
              option: (base, state) => ({
                ...base,
                background: state.isSelected
                  ? (theme === 'light' ? '#e0e0e0' : '#35355a')
                  : state.isFocused
                  ? (theme === 'light' ? '#f7f8fa' : '#28284a')
                  : 'transparent',
                color: theme === 'light' ? '#23243a' : '#fff',
                cursor: 'pointer',
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: theme === 'light' ? '#23243a' : '#b3b3d1',
              }),
              indicatorSeparator: () => ({ display: 'none' }),
            }}
            theme={base => ({
              ...base,
              borderRadius: 8,
              colors: {
                ...base.colors,
                primary25: theme === 'light' ? '#f7f8fa' : '#28284a',
                primary: theme === 'light' ? '#2ecc71' : '#27ae60',
                neutral0: theme === 'light' ? '#fff' : '#23243a',
                neutral80: theme === 'light' ? '#23243a' : '#fff',
              },
            })}
          />
        </div>
        <div style={{ minWidth: 195, marginRight: 12 }}>
          <Select
            value={status}
            onChange={opt => opt && setStatus(opt)}
            options={statusOptions}
            isSearchable={false}
            placeholder="Статус"
            styles={{
              control: (base) => ({ ...base, background: theme === 'light' ? '#f7f8fa' : '#23243a', borderColor: theme === 'light' ? '#e0e0e0' : '#23243a', color: theme === 'light' ? '#23243a' : '#fff', boxShadow: 'none', minHeight: 38, fontWeight: 500, fontSize: '1rem' }),
              singleValue: (base) => ({ ...base, color: theme === 'light' ? '#23243a' : '#fff' }),
              menu: (base) => ({ ...base, background: theme === 'light' ? '#fff' : '#23243a', color: theme === 'light' ? '#23243a' : '#fff', borderRadius: 8, boxShadow: '0 4px 16px #0002' }),
              option: (base, state) => ({ ...base, background: state.isSelected ? (theme === 'light' ? '#e0e0e0' : '#35355a') : state.isFocused ? (theme === 'light' ? '#f7f8fa' : '#28284a') : 'transparent', color: theme === 'light' ? '#23243a' : '#fff', cursor: 'pointer' }),
              dropdownIndicator: (base) => ({ ...base, color: theme === 'light' ? '#23243a' : '#b3b3d1' }),
              indicatorSeparator: () => ({ display: 'none' }),
            }}
          />
        </div>
        <div style={{ minWidth: 195, marginRight: 12 }}>
          <Select
            value={category}
            onChange={opt => opt && setCategory(opt)}
            options={categoryOptions}
            isSearchable={false}
            placeholder="Категория"
            styles={{
              control: (base) => ({ ...base, background: theme === 'light' ? '#f7f8fa' : '#23243a', borderColor: theme === 'light' ? '#e0e0e0' : '#23243a', color: theme === 'light' ? '#23243a' : '#fff', boxShadow: 'none', minHeight: 38, fontWeight: 500, fontSize: '1rem' }),
              singleValue: (base) => ({ ...base, color: theme === 'light' ? '#23243a' : '#fff' }),
              menu: (base) => ({ ...base, background: theme === 'light' ? '#fff' : '#23243a', color: theme === 'light' ? '#23243a' : '#fff', borderRadius: 8, boxShadow: '0 4px 16px #0002' }),
              option: (base, state) => ({ ...base, background: state.isSelected ? (theme === 'light' ? '#e0e0e0' : '#35355a') : state.isFocused ? (theme === 'light' ? '#f7f8fa' : '#28284a') : 'transparent', color: theme === 'light' ? '#23243a' : '#fff', cursor: 'pointer' }),
              dropdownIndicator: (base) => ({ ...base, color: theme === 'light' ? '#23243a' : '#b3b3d1' }),
              indicatorSeparator: () => ({ display: 'none' }),
            }}
          />
        </div>
        <div style={{ minWidth: 195, marginRight: 12 }}>
          <Select
            value={priority}
            onChange={opt => opt && setPriority(opt)}
            options={priorityOptions}
            isSearchable={false}
            placeholder="Приоритет"
            styles={{
              control: (base) => ({ ...base, background: theme === 'light' ? '#f7f8fa' : '#23243a', borderColor: theme === 'light' ? '#e0e0e0' : '#23243a', color: theme === 'light' ? '#23243a' : '#fff', boxShadow: 'none', minHeight: 38, fontWeight: 500, fontSize: '1rem' }),
              singleValue: (base) => ({ ...base, color: theme === 'light' ? '#23243a' : '#fff' }),
              menu: (base) => ({ ...base, background: theme === 'light' ? '#fff' : '#23243a', color: theme === 'light' ? '#23243a' : '#fff', borderRadius: 8, boxShadow: '0 4px 16px #0002' }),
              option: (base, state) => ({ ...base, background: state.isSelected ? (theme === 'light' ? '#e0e0e0' : '#35355a') : state.isFocused ? (theme === 'light' ? '#f7f8fa' : '#28284a') : 'transparent', color: theme === 'light' ? '#23243a' : '#fff', cursor: 'pointer' }),
              dropdownIndicator: (base) => ({ ...base, color: theme === 'light' ? '#23243a' : '#b3b3d1' }),
              indicatorSeparator: () => ({ display: 'none' }),
            }}
          />
        </div>
        <div style={{ minWidth: 195, marginRight: 12 }}>
          <Select
            value={date}
            onChange={opt => opt && setDate(opt)}
            options={dateOptions}
            isSearchable={false}
            placeholder="Дата"
            styles={{
              control: (base) => ({ ...base, background: theme === 'light' ? '#f7f8fa' : '#23243a', borderColor: theme === 'light' ? '#e0e0e0' : '#23243a', color: theme === 'light' ? '#23243a' : '#fff', boxShadow: 'none', minHeight: 38, fontWeight: 500, fontSize: '1rem' }),
              singleValue: (base) => ({ ...base, color: theme === 'light' ? '#23243a' : '#fff' }),
              menu: (base) => ({ ...base, background: theme === 'light' ? '#fff' : '#23243a', color: theme === 'light' ? '#23243a' : '#fff', borderRadius: 8, boxShadow: '0 4px 16px #0002' }),
              option: (base, state) => ({ ...base, background: state.isSelected ? (theme === 'light' ? '#e0e0e0' : '#35355a') : state.isFocused ? (theme === 'light' ? '#f7f8fa' : '#28284a') : 'transparent', color: theme === 'light' ? '#23243a' : '#fff', cursor: 'pointer' }),
              dropdownIndicator: (base) => ({ ...base, color: theme === 'light' ? '#23243a' : '#b3b3d1' }),
              indicatorSeparator: () => ({ display: 'none' }),
            }}
          />
        </div>
      </div>
      <div className={styles.grid}>
        {sorted.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </>
  );
} 
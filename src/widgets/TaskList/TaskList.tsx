import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { TaskItem } from '@/entities/task/ui/TaskItem';
import styles from './TaskList.module.css';
import { useState } from 'react';
import type { Task, TaskPriority } from '@/entities/task/model/types';
import Select from 'react-select';
import type { TaskCategory, TaskStatus } from '@/entities/task/model/types';

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
 * @param {Task} a - первая задача
 * @param {Task} b - вторая задача
 * @param {string} sort - тип сортировки ('newest' | 'oldest' | 'priority')
 * @returns {number}
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
 * Компонент TaskList
 * Отображает список задач с возможностью сортировки
 * @component
 */

export function TaskList() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [sort, setSort] = useState(sortOptions[0]);
  const [status, setStatus] = useState(statusOptions[0]);
  const [category, setCategory] = useState(categoryOptions[0]);
  const [priority, setPriority] = useState(priorityOptions[0]);
  const [date, setDate] = useState(dateOptions[0]);

  const theme = document.body.getAttribute('data-theme') || 'dark';

  // Фильтрация задач
  const filtered = tasks.filter(task => {
    const statusMatch = !status.value || task.status === status.value;
    const categoryMatch = !category.value || task.category === category.value;
    const priorityMatch = !priority.value || task.priority === priority.value;
    let dateMatch = true;
    if (date.value) {
      const created = new Date(task.createdAt);
      const now = new Date();
      if (date.value === 'today') {
        dateMatch = created.toDateString() === now.toDateString();
      } else if (date.value === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        dateMatch = created >= weekAgo && created <= now;
      } else if (date.value === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        dateMatch = created >= monthAgo && created <= now;
      }
    }
    return statusMatch && categoryMatch && priorityMatch && dateMatch;
  });

  const sorted = [...filtered].sort((a, b) => compareTasks(a, b, sort.value));

  if (!tasks.length) {
    return <div className={styles.empty}>Нет задач</div>;
  }

  return (
    <>
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
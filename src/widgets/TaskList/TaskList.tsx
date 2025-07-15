import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { TaskItem } from '@/entities/task/ui/TaskItem';
import styles from './TaskList.module.css';
import { useState } from 'react';
import type { Task, TaskPriority } from '@/entities/task/model/types';
import Select from 'react-select';

const sortOptions = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'priority', label: 'По приоритету' },
];

/**
 * Компонент TaskList
 * Отображает список задач с возможностью сортировки
 * @component
 */

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

export function TaskList() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [sort, setSort] = useState(sortOptions[0]);

  const sorted = [...tasks].sort((a, b) => compareTasks(a, b, sort.value));

  const theme = document.body.getAttribute('data-theme') || 'dark';

  if (!tasks.length) {
    return <div className={styles.empty}>Нет задач</div>;
  }

  return (
    <>
      <div className={styles.sortPanel}>
        <label style={{ marginRight: 8 }}>Сортировка:</label>
        <div style={{ minWidth: 180 }}>
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
      </div>
      <div className={styles.grid}>
        {sorted.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </>
  );
} 
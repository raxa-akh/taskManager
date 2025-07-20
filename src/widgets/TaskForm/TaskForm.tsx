import { useState } from 'react';
import type { Task, TaskCategory, TaskPriority, TaskStatus } from '@/entities/task/model/types';
import styles from './TaskForm.module.css';
import Select from 'react-select';

const categories: { value: TaskCategory; label: string }[] = [
  { value: 'Bug', label: 'Bug' },
  { value: 'Feature', label: 'Feature' },
  { value: 'Documentation', label: 'Documentation' },
  { value: 'Refactor', label: 'Refactor' },
  { value: 'Test', label: 'Test' },
];
const statuses: { value: TaskStatus; label: string }[] = [
  { value: 'To Do', label: 'To Do' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Done', label: 'Done' },
];
const priorities: { value: TaskPriority; label: string }[] = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

/**
 * Пропсы для компонента TaskForm
 * @typedef {Object} TaskFormProps
 * @property {Partial<Task>} [initial] - Начальные значения для редактирования задачи
 * @property {(task: Omit<Task, 'id' | 'createdAt'>) => void} onSubmit - Обработчик сохранения формы
 * @property {() => void} onCancel - Обработчик отмены формы
 * @property {'create' | 'edit'} [mode] - Режим работы формы (создание или редактирование)
 */
interface TaskFormProps {
  initial?: Partial<Task>;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  mode?: 'create' | 'edit';
}

/**
 * Универсальная форма для создания и редактирования задач
 * Поддерживает валидацию полей, адаптивный дизайн и интеграцию с темой
 * Автоматически подстраивается под режим создания или редактирования
 * 
 * @component
 * @param {TaskFormProps} props - Пропсы компонента
 * @returns {JSX.Element} Форма для работы с задачами
 */
export function TaskForm({ initial = {}, onSubmit, onCancel, mode = 'create' }: TaskFormProps) {
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');
  const [category, setCategory] = useState(categories.find(c => c.value === initial.category) || categories[0]);
  const [status, setStatus] = useState(statuses.find(s => s.value === initial.status) || statuses[0]);
  const [priority, setPriority] = useState(priorities.find(p => p.value === initial.priority) || priorities[1]);
  const [error, setError] = useState('');

  const theme = document.body.getAttribute('data-theme') || 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Заголовок обязателен');
      return;
    }
    setError('');
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category: category.value,
      status: status.value,
      priority: priority.value,
    });
  };

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      background: theme === 'light' ? '#f7f8fa' : '#2e2e4d',
      borderColor: theme === 'light' ? '#e0e0e0' : '#23243a',
      color: theme === 'light' ? '#23243a' : '#fff',
      boxShadow: 'none',
      minHeight: 38,
      fontWeight: 500,
      fontSize: '1rem',
    }),
    singleValue: (base: any) => ({
      ...base,
      color: theme === 'light' ? '#23243a' : '#fff',
    }),
    menu: (base: any) => ({
      ...base,
      background: theme === 'light' ? '#fff' : '#2e2e4d',
      color: theme === 'light' ? '#23243a' : '#fff',
      borderRadius: 8,
      boxShadow: '0 4px 16px #0002',
    }),
    option: (base: any, state: any) => ({
      ...base,
      background: state.isSelected
        ? (theme === 'light' ? '#e0e0e0' : '#35355a')
        : state.isFocused
        ? (theme === 'light' ? '#f7f8fa' : '#28284a')
        : 'transparent',
      color: theme === 'light' ? '#23243a' : '#fff',
      cursor: 'pointer',
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      color: theme === 'light' ? '#23243a' : '#b3b3d1',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>{mode === 'edit' ? 'Редактировать задачу' : 'Создать задачу'}</h2>
      <label className={styles.label}>
        Заголовок*
        <input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} required />
      </label>
      <label className={styles.label}>
        Описание
        <textarea className={styles.input} value={description} onChange={e => setDescription(e.target.value)} rows={3} />
      </label>
      <div className={styles.row}>
        <div style={{ flex: 1 }}>
          <label className={styles.label}>
            Категория
            <Select
              value={category}
              onChange={opt => opt && setCategory(opt)}
              options={categories}
              isSearchable={false}
              styles={selectStyles}
              theme={base => ({
                ...base,
                borderRadius: 8,
                colors: {
                  ...base.colors,
                  primary25: theme === 'light' ? '#f7f8fa' : '#28284a',
                  primary: theme === 'light' ? '#2ecc71' : '#27ae60',
                  neutral0: theme === 'light' ? '#fff' : '#2e2e4d',
                  neutral80: theme === 'light' ? '#23243a' : '#fff',
                },
              })}
            />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <label className={styles.label}>
            Статус
            <Select
              value={status}
              onChange={opt => opt && setStatus(opt)}
              options={statuses}
              isSearchable={false}
              styles={selectStyles}
              theme={base => ({
                ...base,
                borderRadius: 8,
                colors: {
                  ...base.colors,
                  primary25: theme === 'light' ? '#f7f8fa' : '#28284a',
                  primary: theme === 'light' ? '#2ecc71' : '#27ae60',
                  neutral0: theme === 'light' ? '#fff' : '#2e2e4d',
                  neutral80: theme === 'light' ? '#23243a' : '#fff',
                },
              })}
            />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <label className={styles.label}>
            Приоритет
            <Select
              value={priority}
              onChange={opt => opt && setPriority(opt)}
              options={priorities}
              isSearchable={false}
              styles={selectStyles}
              theme={base => ({
                ...base,
                borderRadius: 8,
                colors: {
                  ...base.colors,
                  primary25: theme === 'light' ? '#f7f8fa' : '#28284a',
                  primary: theme === 'light' ? '#2ecc71' : '#27ae60',
                  neutral0: theme === 'light' ? '#fff' : '#2e2e4d',
                  neutral80: theme === 'light' ? '#23243a' : '#fff',
                },
              })}
            />
          </label>
        </div>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.actions}>
        <button className={styles.save} type="submit">Сохранить</button>
        <button className={styles.cancel} type="button" onClick={onCancel}>Отмена</button>
      </div>
    </form>
  );
} 
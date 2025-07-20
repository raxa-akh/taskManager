import type { Task } from '../model/types';
import styles from './TaskItem.module.css';
import { useDispatch } from 'react-redux';
import { deleteTask } from '../model/taskApiSlice';
import type { AppDispatch } from '@/app/store';
import { useNavigate } from 'react-router-dom';

/**
 * Пропсы для компонента TaskItem
 * @typedef {Object} TaskItemProps
 * @property {Task} task - Задача для отображения
 */
interface TaskItemProps {
  task: Task;
}

/**
 * Компонент для отображения отдельной задачи
 * Отображает заголовок, описание, категорию, статус, приоритет и дату создания
 * Поддерживает редактирование по клику и удаление
 * 
 * @component
 * @param {TaskItemProps} props - Пропсы компонента
 * @returns {JSX.Element} Элемент карточки задачи
 */

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleString();
}



export function TaskItem({ task }: TaskItemProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteTask(task.id));
  };

  const handleEdit = () => {
    navigate(`/task/${task.id}`);
  };

  return (
    <div className={styles.card} tabIndex={0} onClick={handleEdit}>
      <div className={styles.header}>
        <h3 className={styles.title} title={task.title}>{task.title}</h3>
        <span className={styles.date}>{formatDate(task.createdAt)}</span>
      </div>
      {task.description && (
        <p className={styles.desc} title={task.description}>
          {task.description}
        </p>
      )}
      <div className={styles.tags}>
        <span className={styles.chip + ' ' + styles[task.category.toLowerCase()]}>Категория: {task.category}</span>
        <span className={styles.chip + ' ' + styles[task.status.replace(/\s/g, '').toLowerCase()]}>Статус: {task.status}</span>
        <span className={styles.chip + ' ' + styles[task.priority.toLowerCase()]}>Приоритет: {task.priority}</span>
      </div>
      <button className={styles.delete} title="Удалить" onClick={handleDelete}>🗑</button>
    </div>
  );
} 
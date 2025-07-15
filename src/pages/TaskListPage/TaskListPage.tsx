import { TaskList } from '@/widgets/TaskList/TaskList';
import { useNavigate } from 'react-router-dom';
import styles from './TaskListPage.module.css';

export function TaskListPage() {
  const navigate = useNavigate();
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Менеджер задач</h1>
      <button className={styles.createBtn} onClick={() => navigate('/task/new')}>
        + Создать задачу
      </button>
      <TaskList />
    </div>
  );
} 
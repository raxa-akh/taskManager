import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TaskForm } from '@/widgets/TaskForm/TaskForm';
import { updateTask } from '@/entities/task/model/taskSlice';
import type { RootState, AppDispatch } from '@/app/store';

export function TaskEditPage() {
  const { id } = useParams<{ id: string }>();
  const task = useSelector((state: RootState) => state.tasks.tasks.find(t => t.id === id));
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  if (!task) {
    return <div style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>Задача не найдена</div>;
  }

  const handleSubmit = (data: any) => {
    dispatch(updateTask({ ...task, ...data }));
    navigate('/');
  };

  return <TaskForm initial={task} onSubmit={handleSubmit} onCancel={() => navigate('/')} mode="edit" />;
} 
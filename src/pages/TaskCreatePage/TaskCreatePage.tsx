import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { TaskForm } from '@/widgets/TaskForm/TaskForm';
import { createTask } from '@/entities/task/model/taskApiSlice';
import type { AppDispatch } from '@/app/store';
import type { Task } from '@/entities/task/model/types';

export function TaskCreatePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = (data: { title: string; description?: string; category: Task['category']; status: Task['status']; priority: Task['priority'] }) => {
    dispatch(createTask(data));
    navigate('/');
  };

  return <TaskForm onSubmit={handleSubmit} onCancel={() => navigate('/')} mode="create" />;
} 
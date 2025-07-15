import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { TaskForm } from '@/widgets/TaskForm/TaskForm';
import { createTask } from '@/entities/task/model/taskSlice';
import type { AppDispatch } from '@/app/store';
import { nanoid } from 'nanoid';

export function TaskCreatePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    dispatch(createTask({
      ...data,
      id: nanoid(),
      createdAt: new Date().toISOString(),
    }));
    navigate('/');
  };

  return <TaskForm onSubmit={handleSubmit} onCancel={() => navigate('/')} mode="create" />;
} 
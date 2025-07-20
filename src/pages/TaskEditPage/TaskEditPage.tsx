import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TaskForm } from '@/widgets/TaskForm/TaskForm';
import { updateTask, fetchTaskById } from '@/entities/task/model/taskApiSlice';
import type { RootState, AppDispatch } from '@/app/store';
import type { Task } from '@/entities/task/model/types';
import { useEffect } from 'react';

export function TaskEditPage() {
  const { id } = useParams<{ id: string }>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const task = tasks.find(t => t.id === id);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id && !task) {
      dispatch(fetchTaskById(id));
    }
  }, [id, task, dispatch]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>Загрузка...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>Ошибка: {error}</div>;
  }

  if (!task) {
    return <div style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>Задача не найдена</div>;
  }

  const handleSubmit = (data: { title: string; description?: string; category: Task['category']; status: Task['status']; priority: Task['priority'] }) => {
    dispatch(updateTask({ id: task.id, updateData: data }));
    navigate('/');
  };

  return <TaskForm initial={task} onSubmit={handleSubmit} onCancel={() => navigate('/')} mode="edit" />;
} 
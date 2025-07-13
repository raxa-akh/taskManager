import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Grid,
} from '@mui/material';
import { useTasks } from '../context/TasksContext';
import { TaskCategory, TaskStatus, TaskPriority } from '../types/task';
import type { Task } from '../types/task';

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, updateTask } = useTasks();
  
  const [formData, setFormData] = useState<Task>({
    id: '',
    title: '',
    description: '',
    category: TaskCategory.Bug,
    status: TaskStatus.ToDo,
    priority: TaskPriority.Medium,
  });

  useEffect(() => {
    if (id) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        setFormData(task);
      } else {
        // Если задача не найдена, возвращаемся к списку
        navigate('/');
      }
    }
  }, [id, tasks, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTask(formData);
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleChange = (field: keyof Task, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!id) {
    return <Typography>Задача не найдена</Typography>;
  }

  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ maxWidth: 600, width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Редактирование задачи
        </Typography>
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Заголовок"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Описание"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                multiline
                rows={4}
              />
              <FormControl fullWidth>
                <InputLabel>Категория</InputLabel>
                <Select
                  value={formData.category}
                  label="Категория"
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  <MenuItem value={TaskCategory.Bug}>{TaskCategory.Bug}</MenuItem>
                  <MenuItem value={TaskCategory.Feature}>{TaskCategory.Feature}</MenuItem>
                  <MenuItem value={TaskCategory.Documentation}>{TaskCategory.Documentation}</MenuItem>
                  <MenuItem value={TaskCategory.Refactor}>{TaskCategory.Refactor}</MenuItem>
                  <MenuItem value={TaskCategory.Test}>{TaskCategory.Test}</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Статус</InputLabel>
                <Select
                  value={formData.status}
                  label="Статус"
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <MenuItem value={TaskStatus.ToDo}>{TaskStatus.ToDo}</MenuItem>
                  <MenuItem value={TaskStatus.InProgress}>{TaskStatus.InProgress}</MenuItem>
                  <MenuItem value={TaskStatus.Done}>{TaskStatus.Done}</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Приоритет</InputLabel>
                <Select
                  value={formData.priority}
                  label="Приоритет"
                  onChange={(e) => handleChange('priority', e.target.value)}
                >
                  <MenuItem value={TaskPriority.Low}>{TaskPriority.Low}</MenuItem>
                  <MenuItem value={TaskPriority.Medium}>{TaskPriority.Medium}</MenuItem>
                  <MenuItem value={TaskPriority.High}>{TaskPriority.High}</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={handleCancel}>
                  Отмена
                </Button>
                <Button variant="contained" type="submit">
                  Сохранить
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default TaskDetails; 
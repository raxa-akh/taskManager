import React from 'react';
import { useTasks } from '../context/TasksContext';
import { TaskStatus, TaskCategory, TaskPriority } from '../types/task';
import { Grid, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import TaskItem from './TaskItem';

const statusOptions = [undefined, TaskStatus.ToDo, TaskStatus.InProgress, TaskStatus.Done];
const categoryOptions = [undefined, TaskCategory.Bug, TaskCategory.Feature, TaskCategory.Documentation, TaskCategory.Refactor, TaskCategory.Test];
const priorityOptions = [undefined, TaskPriority.Low, TaskPriority.Medium, TaskPriority.High];

const TaskList: React.FC = () => {
  const { tasks, filter, setFilter } = useTasks();

  const filteredTasks = tasks.filter((task) => {
    return (
      (!filter.status || task.status === filter.status) &&
      (!filter.category || task.category === filter.category) &&
      (!filter.priority || task.priority === filter.priority)
    );
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Список задач</Typography>
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Статус</InputLabel>
          <Select
            value={filter.status || ''}
            label="Статус"
            onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
          >
            <MenuItem value="">Все</MenuItem>
            {statusOptions.slice(1).map((status) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 140 }} size="small">
          <InputLabel>Категория</InputLabel>
          <Select
            value={filter.category || ''}
            label="Категория"
            onChange={(e) => setFilter({ ...filter, category: e.target.value || undefined })}
          >
            <MenuItem value="">Все</MenuItem>
            {categoryOptions.slice(1).map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Приоритет</InputLabel>
          <Select
            value={filter.priority || ''}
            label="Приоритет"
            onChange={(e) => setFilter({ ...filter, priority: e.target.value || undefined })}
          >
            <MenuItem value="">Все</MenuItem>
            {priorityOptions.slice(1).map((prio) => (
              <MenuItem key={prio} value={prio}>{prio}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={2}>
        {filteredTasks.length === 0 ? (
          <Grid item xs={12}>
            <Typography color="text.secondary">Нет задач по выбранным фильтрам.</Typography>
          </Grid>
        ) : (
          filteredTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
              <TaskItem task={task} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default TaskList; 
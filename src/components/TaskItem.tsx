import React from 'react';
import { Card, CardContent, Typography, Chip, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'To Do':
      return 'default';
    case 'In Progress':
      return 'warning';
    case 'Done':
      return 'success';
    default:
      return 'default';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Bug':
      return 'error';
    case 'Feature':
      return 'primary';
    case 'Documentation':
      return 'info';
    case 'Refactor':
      return 'secondary';
    case 'Test':
      return 'warning';
    default:
      return 'default';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'error';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'success';
    default:
      return 'default';
  }
};

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/task/${task.id}`);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {task.title}
        </Typography>
        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {task.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            label={task.category}
            color={getCategoryColor(task.category) as any}
            size="small"
          />
          <Chip
            label={task.status}
            color={getStatusColor(task.status) as any}
            size="small"
          />
          <Chip
            label={task.priority}
            color={getPriorityColor(task.priority) as any}
            size="small"
          />
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={handleEdit}
          sx={{ mt: 'auto' }}
        >
          Редактировать
        </Button>
      </CardContent>
    </Card>
  );
};

export default TaskItem; 
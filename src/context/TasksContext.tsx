import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Task } from '../types/task';
import { TaskCategory, TaskPriority, TaskStatus } from '../types/task';

interface TasksContextType {
  tasks: Task[];
  updateTask: (updatedTask: Task) => void;
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
}

export interface TaskFilter {
  status?: TaskStatus;
  category?: TaskCategory;
  priority?: TaskPriority;
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Fix login bug',
    description: 'Ошибка при входе на сайт',
    category: TaskCategory.Bug,
    status: TaskStatus.ToDo,
    priority: TaskPriority.High,
  },
  {
    id: '2',
    title: 'Add dark mode',
    description: 'Реализовать тёмную тему',
    category: TaskCategory.Feature,
    status: TaskStatus.InProgress,
    priority: TaskPriority.Medium,
  },
  {
    id: '3',
    title: 'Update docs',
    description: 'Обновить документацию по API',
    category: TaskCategory.Documentation,
    status: TaskStatus.Done,
    priority: TaskPriority.Low,
  },
];

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<TaskFilter>({});

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  return (
    <TasksContext.Provider value={{ tasks, updateTask, filter, setFilter }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}; 
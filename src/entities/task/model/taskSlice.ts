import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Task } from './types';

const loadTasks = (): Task[] => {
  try {
    const data = localStorage.getItem('tasks');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: loadTasks(),
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    createTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
      saveTasks(state.tasks);
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      saveTasks(state.tasks);
    },
    updateTask(state, action: PayloadAction<Task>) {
      const idx = state.tasks.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) {
        state.tasks[idx] = action.payload;
        saveTasks(state.tasks);
      }
    },
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
      saveTasks(state.tasks);
    },
  },
});

export const { createTask, deleteTask, updateTask, setTasks } = taskSlice.actions;
export default taskSlice.reducer; 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Task } from './types';
import { fakeApi } from '@/shared/api/fakeApi';

/**
 * Интерфейс состояния задач с API
 */
interface TaskApiState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskApiState = {
  tasks: [],
  loading: false,
  error: null,
};

/**
 * Асинхронное действие для получения всех задач
 */
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    const response = await fakeApi.getAllTasks();
    if (!response.success) {
      throw new Error(response.message || 'Ошибка при получении задач');
    }
    return response.data;
  }
);

/**
 * Асинхронное действие для получения задачи по ID
 */
export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (id: string) => {
    const response = await fakeApi.getTaskById(id);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Задача не найдена');
    }
    return response.data;
  }
);

/**
 * Асинхронное действие для создания задачи
 */
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: {
    title: string;
    description?: string;
    category: Task['category'];
    status: Task['status'];
    priority: Task['priority'];
  }) => {
    const response = await fakeApi.createTask(taskData);
    if (!response.success) {
      throw new Error(response.message || 'Ошибка при создании задачи');
    }
    return response.data;
  }
);

/**
 * Асинхронное действие для обновления задачи
 */
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updateData }: { id: string; updateData: Partial<Task> }) => {
    const response = await fakeApi.updateTask(id, updateData);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Ошибка при обновлении задачи');
    }
    return response.data;
  }
);

/**
 * Асинхронное действие для удаления задачи
 */
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string) => {
    const response = await fakeApi.deleteTask(id);
    if (!response.success) {
      throw new Error(response.message || 'Ошибка при удалении задачи');
    }
    return id;
  }
);



const taskApiSlice = createSlice({
  name: 'taskApi',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при получении задач';
      });

    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при создании задачи';
      });

    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при обновлении задачи';
      });

    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при удалении задачи';
      });

  },
});

export const { clearError } = taskApiSlice.actions;
export default taskApiSlice.reducer; 
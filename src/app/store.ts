import { configureStore } from '@reduxjs/toolkit';
import taskApiReducer from '@/entities/task/model/taskApiSlice';

export const store = configureStore({
  reducer: {
    tasks: taskApiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
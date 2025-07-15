import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '@/entities/task/model/taskSlice';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
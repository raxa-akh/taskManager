import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TaskListPage } from '@/pages/TaskListPage/TaskListPage';
import { TaskCreatePage } from '@/pages/TaskCreatePage/TaskCreatePage';
import { TaskEditPage } from '@/pages/TaskEditPage/TaskEditPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TaskListPage />} />
        <Route path="/task/new" element={<TaskCreatePage />} />
        <Route path="/task/:id" element={<TaskEditPage />} />
      </Routes>
    </BrowserRouter>
  );
} 
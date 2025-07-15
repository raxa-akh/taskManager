/**
 * Интерфейс задачи для менеджера задач
 * @typedef {Object} Task
 * @property {string} id - Уникальный идентификатор
 * @property {string} title - Заголовок задачи
 * @property {string} [description] - Описание задачи
 * @property {TaskCategory} category - Категория задачи
 * @property {TaskStatus} status - Статус задачи
 * @property {TaskPriority} priority - Приоритет задачи
 * @property {string} createdAt - Дата создания 
 */

export type TaskCategory = 'Bug' | 'Feature' | 'Documentation' | 'Refactor' | 'Test';
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
} 
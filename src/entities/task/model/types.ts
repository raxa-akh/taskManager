/**
 * Типы категорий задач
 * @typedef {'Bug' | 'Feature' | 'Documentation' | 'Refactor' | 'Test'} TaskCategory
 */
export type TaskCategory = 'Bug' | 'Feature' | 'Documentation' | 'Refactor' | 'Test';

/**
 * Типы статусов задач
 * @typedef {'To Do' | 'In Progress' | 'Done'} TaskStatus
 */
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

/**
 * Типы приоритетов задач
 * @typedef {'Low' | 'Medium' | 'High'} TaskPriority
 */
export type TaskPriority = 'Low' | 'Medium' | 'High';

/**
 * Интерфейс задачи для менеджера задач
 * Описывает полную структуру задачи с обязательными и опциональными полями
 * 
 * @typedef {Object} Task
 * @property {string} id - Уникальный идентификатор задачи
 * @property {string} title - Заголовок задачи (обязательное поле)
 * @property {string} [description] - Описание задачи (опциональное поле)
 * @property {TaskCategory} category - Категория задачи
 * @property {TaskStatus} status - Текущий статус задачи
 * @property {TaskPriority} priority - Приоритет задачи
 * @property {string} createdAt - Дата и время создания задачи 
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
} 
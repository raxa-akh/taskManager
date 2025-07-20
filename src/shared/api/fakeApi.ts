import type { Task } from '@/entities/task/model/types';

/**
 * Интерфейс для ответа API
 * @template T - Тип данных в ответе
 */
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}



/**
 * Интерфейс для создания новой задачи
 */
interface CreateTaskData {
  title: string;
  description?: string;
  category: Task['category'];
  status: Task['status'];
  priority: Task['priority'];
}

/**
 * Интерфейс для обновления задачи
 */
interface UpdateTaskData {
  title?: string;
  description?: string;
  category?: Task['category'];
  status?: Task['status'];
  priority?: Task['priority'];
}

/**
 * Класс для имитации REST API
 * Хранит данные в localStorage и предоставляет CRUD операции
 */
class FakeApi {
  private readonly storageKey = 'tasks';

  private getTasks(): Task[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private async delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * GET /tasks - Получение всех задач
   * @returns {Promise<ApiResponse<Task[]>>} Ответ с массивом задач
   */
  async getAllTasks(): Promise<ApiResponse<Task[]>> {
    await this.delay();
    const tasks = this.getTasks();
    return {
      data: tasks,
      success: true,
      message: `Получено ${tasks.length} задач`
    };
  }

  /**
   * GET /tasks/:id - Получение задачи по ID
   * @param {string} id - Идентификатор задачи
   * @returns {Promise<ApiResponse<Task | null>>} Ответ с задачей или null
   */
  async getTaskById(id: string): Promise<ApiResponse<Task | null>> {
    await this.delay();
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
      return {
        data: null,
        success: false,
        message: 'Задача не найдена'
      };
    }

    return {
      data: task,
      success: true,
      message: 'Задача найдена'
    };
  }

  /**
   * POST /tasks - Создание новой задачи
   * @param {CreateTaskData} taskData - Данные для создания задачи
   * @returns {Promise<ApiResponse<Task>>} Ответ с созданной задачей
   */
  async createTask(taskData: CreateTaskData): Promise<ApiResponse<Task>> {
    await this.delay();
    
    const newTask: Task = {
      id: this.generateId(),
      ...taskData,
      createdAt: new Date().toISOString()
    };

    const tasks = this.getTasks();
    tasks.push(newTask);
    this.saveTasks(tasks);

    return {
      data: newTask,
      success: true,
      message: 'Задача успешно создана'
    };
  }

  /**
   * PATCH /tasks/:id - Обновление задачи
   * @param {string} id - Идентификатор задачи
   * @param {UpdateTaskData} updateData - Данные для обновления
   * @returns {Promise<ApiResponse<Task | null>>} Ответ с обновленной задачей
   */
  async updateTask(id: string, updateData: UpdateTaskData): Promise<ApiResponse<Task | null>> {
    await this.delay();
    
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      return {
        data: null,
        success: false,
        message: 'Задача не найдена'
      };
    }

    const updatedTask = { ...tasks[taskIndex], ...updateData };
    tasks[taskIndex] = updatedTask;
    this.saveTasks(tasks);

    return {
      data: updatedTask,
      success: true,
      message: 'Задача успешно обновлена'
    };
  }

  /**
   * DELETE /tasks/:id - Удаление задачи
   * @param {string} id - Идентификатор задачи
   * @returns {Promise<ApiResponse<boolean>>} Ответ с результатом удаления
   */
  async deleteTask(id: string): Promise<ApiResponse<boolean>> {
    await this.delay();
    
    const tasks = this.getTasks();
    const initialLength = tasks.length;
    const filteredTasks = tasks.filter(t => t.id !== id);
    
    if (filteredTasks.length === initialLength) {
      return {
        data: false,
        success: false,
        message: 'Задача не найдена'
      };
    }

    this.saveTasks(filteredTasks);

    return {
      data: true,
      success: true,
      message: 'Задача успешно удалена'
    };
  }


}

// Экспортируем экземпляр API
export const fakeApi = new FakeApi(); 
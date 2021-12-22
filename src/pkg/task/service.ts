import {Task} from '../entities/task';
import {TaskRepository} from './repository';

export interface TaskPage {
  pageInfo: {
    total: number;
    perPage: number;
    currentPage: number;
    hasNextPage: boolean;
  };
  tasks: Task[];
}

export interface ITaskService {
  insertTask(task: Task): Promise<boolean>;
  getTaskPage(page: number, limit: number): Promise<TaskPage>;
}

export class TaskService implements ITaskService {
  private readonly repository: TaskRepository;

  public constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  public insertTask(task: Task): Promise<boolean> {
    return this.repository.createTask(task);
  }

  public async getTaskPage(page: number, limit: number): Promise<TaskPage> {
    const total = await this.repository.countTask();
    return {
      pageInfo: {
        total,
        perPage: limit,
        currentPage: page,
        hasNextPage: Math.ceil(total / limit) > page,
      },
      tasks: await this.repository.findTaskPage(page, limit),
    };
  }
}

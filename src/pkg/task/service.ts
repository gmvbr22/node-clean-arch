import {Task} from '../entities/task';
import {TaskRepository} from './repository';

export interface ITaskService {
  insertTask(task: Task): Promise<boolean>;
}

export class TaskService implements ITaskService {
  private readonly repository: TaskRepository;

  public constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  public insertTask(task: Task): Promise<boolean> {
    return this.repository.createTask(task);
  }
}

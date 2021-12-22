import {Collection, Filter, FindOptions} from 'mongodb';
import {Task} from '../entities/task';

export interface ITaskRepository {
  countTask(): Promise<number>;
  createTask(task: Task): Promise<boolean>;
  findTaskPage(page: number, limit: number): Promise<Task[]>;
}

export class TaskRepository implements ITaskRepository {
  public readonly collection: Collection;

  public constructor(collection: Collection) {
    this.collection = collection;
  }

  public async countTask(): Promise<number> {
    return this.collection.countDocuments();
  }

  public async createTask(task: Task): Promise<boolean> {
    const {name, description} = task;
    const insert = await this.collection.insertOne({name, description});
    return insert.acknowledged;
  }

  public async findTaskPage(page: number, limit: number): Promise<Task[]> {
    const filter: Filter<Task> = {};
    const options: FindOptions<Task> = {
      projection: {
        _id: 1,
        name: 1,
        description: 1,
      },
      skip: (page - 1) * limit,
      limit: limit,
    };
    return this.collection.find<Task>(filter, options).toArray();
  }
}

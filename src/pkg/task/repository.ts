import {Collection} from 'mongodb';
import {Task} from '../entities/task';

export interface ITaskRepository {
  createTask(task: Task): Promise<boolean>;
}

export class TaskRepository implements ITaskRepository {
  public readonly collection: Collection;

  public constructor(collection: Collection) {
    this.collection = collection;
  }

  public async createTask(task: Task): Promise<boolean> {
    const {name, description} = task;
    const insert = await this.collection.insertOne({name, description});
    return insert.acknowledged;
  }
}

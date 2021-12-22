import fastify from 'fastify';
import fastifySensible from 'fastify-sensible';

import envSchema from 'env-schema';
import {MongoClient} from 'mongodb';

import {TaskRepository} from '../pkg/task/repository';
import {TaskService} from '../pkg/task/service';
import {TaskRouter} from './routes/task';

async function main() {
  const config = getConfig();
  const {database} = await initDB(config.MONGO_URL);

  const app = fastify().register(fastifySensible);

  const taskRepository = new TaskRepository(database.collection('task'));
  const taskService = new TaskService(taskRepository);
  TaskRouter(app, taskService);

  await app.listen(config.PORT, config.HOST);
}

function getConfig() {
  return envSchema({
    schema: {
      type: 'object',
      required: ['PORT', 'HOST', 'MONGO_URL'],
      properties: {
        PORT: {type: 'integer', default: 3000},
        HOST: {type: 'string', default: '0.0.0.0'},
        MONGO_URL: {type: 'string'},
      },
    },
    dotenv: true,
  }) as {
    PORT: number;
    HOST: string;
    MONGO_URL: string;
  };
}

async function initDB(url: string) {
  const client = await MongoClient.connect(url);
  return {
    client,
    database: client.db(),
  };
}

main();

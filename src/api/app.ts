import fastify, {FastifyInstance} from 'fastify';

import fastifyHelmet from 'fastify-helmet';
import fastifySensible from 'fastify-sensible';

import envSchema from 'env-schema';
import {Db, MongoClient} from 'mongodb';

import {TaskRepository} from '../pkg/task/repository';
import {TaskService} from '../pkg/task/service';
import {TaskRouter} from './routes/task';

async function main() {
  const {PORT, HOST, MONGO_URL} = getConfig();
  const {db} = await initDB(MONGO_URL);

  const app = fastify();

  app.register(fastifySensible);
  app.register(fastifyHelmet);

  initApp(app, db);

  return app.listen(PORT, HOST);
}

function initApp(app: FastifyInstance, db: Db) {
  const taskRepository = new TaskRepository(db.collection('task'));
  const taskService = new TaskService(taskRepository);

  TaskRouter(app, taskService);
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
    db: client.db(),
  };
}

main();

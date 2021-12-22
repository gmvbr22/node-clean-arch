import S from 'fluent-json-schema';
import {FastifyInstance} from 'fastify';
import {ITaskService} from '../../pkg/task/service';
import {RouterOptions} from '../utils/fastify';

export function TaskRouter(app: FastifyInstance, task: ITaskService) {
  app.route(getTask(task));
  app.route(addTask(task));
}

function getTask(task: ITaskService): RouterOptions<{
  Querystring: {
    page: number;
    limit: number;
  };
}> {
  return {
    url: '/task',
    method: 'GET',
    schema: {
      querystring: S.object()
        .prop('page', S.integer().minimum(1).required())
        .prop(
          'limit',
          S.integer().minimum(10).maximum(40).default(10).required()
        ),
    },
    handler: async function (req, reply) {
      try {
        const {page, limit} = req.query;
        const result = await task.getTaskPage(page, limit);
        return {success: true, ...result};
      } catch (e) {
        return reply.internalServerError();
      }
    },
  };
}

function addTask(task: ITaskService): RouterOptions<{
  Body: {
    name: string;
    description: string;
  };
}> {
  return {
    url: '/task',
    method: 'POST',
    schema: {
      body: S.object()
        .prop('name', S.string().required())
        .prop('description', S.string().required()),
    },
    handler: async function (req, reply) {
      try {
        const {name, description} = req.body;
        const insert = await task.insertTask({name, description});
        return {success: insert};
      } catch (e) {
        return reply.internalServerError();
      }
    },
  };
}

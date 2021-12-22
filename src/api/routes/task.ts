import S from 'fluent-json-schema';
import {FastifyInstance} from 'fastify';
import {ITaskService} from '../../pkg/task/service';
import {RouterOptions} from '../utils/fastify';

export function TaskRouter(app: FastifyInstance, task: ITaskService) {
  app.route(addTask(task));
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

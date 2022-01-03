/* eslint-disable node/no-unpublished-import */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {TaskRouter} from './task';
import {testRoutes} from 'fastify-test';
import fastifySensible from 'fastify-sensible';

describe('TaskRouter', () => {
  testRoutes({
    async before(app) {
      app.register(fastifySensible);
      TaskRouter(app, {
        insertTask: jest
          .fn()
          .mockImplementationOnce(() => true)
          .mockImplementationOnce(() => {
            throw new Error();
          }),
        getTaskPage: jest
          .fn()
          .mockImplementationOnce((page: number, limit: number) => ({
            pageInfo: {
              total: 1,
              perPage: limit,
              currentPage: page,
              hasNextPage: Math.ceil(1 / limit) > page,
            },
            tasks: [
              {
                _id: 'task id',
                name: 'task name',
                description: 'task description',
              },
            ],
          }))
          .mockImplementationOnce(() => {
            throw new Error();
          }),
      } as any);
    },
    tests: [
      {
        name: 'POST /task should return true',
        options: {
          path: '/task',
          method: 'POST',
          payload: {
            name: 'Task name',
            description: 'Task description',
          },
        },
        expect: {
          statusCode: 200,
          json: {
            success: true,
          },
        },
      },
      {
        name: 'POST /task should return an error',
        options: {
          path: '/task',
          method: 'POST',
          payload: {
            name: 'Task name',
            description: 'Task description',
          },
        },
        expect: {
          statusCode: 500,
          json: {
            error: 'Internal Server Error',
            message: 'Internal Server Error',
            statusCode: 500,
          },
        },
      },
      {
        name: 'GET /task should return tasks',
        options: {
          path: '/task',
          method: 'GET',
          query: {
            page: '1',
            limit: '20',
          },
        },
        expect: {
          statusCode: 200,
          json: {
            success: true,
            pageInfo: {
              total: 1,
              perPage: 20,
              currentPage: 1,
              hasNextPage: false,
            },
            tasks: [
              {
                _id: 'task id',
                name: 'task name',
                description: 'task description',
              },
            ],
          },
        },
      },
      {
        name: 'GET /task should return an error',
        options: {
          path: '/task',
          method: 'GET',
          query: {
            page: '1',
            limit: '20',
          },
        },
        expect: {
          statusCode: 500,
          json: {
            error: 'Internal Server Error',
            message: 'Internal Server Error',
            statusCode: 500,
          },
        },
      },
    ],
  });
});

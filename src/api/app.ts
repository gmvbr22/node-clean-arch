import fastify from 'fastify';

async function main() {
  const app = fastify();
  await app.listen(8080);
}

main();

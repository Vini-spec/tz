const fastify = require("fastify")({ logger: true });
const uploadRoutes = require('./routes/upload');
const readRoutes = require('./routes/read');
const multipart = require('@fastify/multipart');
const filterRoutes = require('./routes/filter');
const fastifyCors = require('@fastify/cors');

fastify.register(multipart, {
   addToBody: true, 
 });
 
 

fastify.register(uploadRoutes);
fastify.register(readRoutes);
fastify.register(filterRoutes);

fastify.register(fastifyCors, {
   methods: ['GET', 'POST', 'PUT', 'DELETE'], 
   allowedHeaders: ['Content-Type', 'Authorization'], 
   credentials: true 
 });

fastify.get('/', async (request, reply) => {
   reply.send({ message: 'Hello! Use /filter with start and end query parameters.' });
 });


const start = async () => {
   try {
      await fastify.listen({ port: 3000 });
      fastify.log.info('Server is running on http://localhost:3000');
   } catch (err) {
      fastify.log.error(err);
      process.exit(1);
   }
};
start();

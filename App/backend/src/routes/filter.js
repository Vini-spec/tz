const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Ajv = require('ajv');
const { request } = require('http');
const { timeStamp } = require('console');
const { on } = require('events');

const ajv = new Ajv({ allErrors: true });


ajv.addFormat('custom-date-time', (dateString) => {
   const date = new Date(dateString);
   return !isNaN(date.getTime());
 });

 

module.exports = async function (fastify, options) {

   const querySchema = {
      type: 'object',
      required: ['start', 'end'],
      properties: {
         start: { type: 'string', format: 'custom-date-time' },
         end: { type: 'string', format: 'custom-date-time' }
      }
   };

   fastify.setValidatorCompiler(({ schema }) => ajv.compile(schema));


   fastify.get('/filter', {
      schema: {
         querystring: querySchema
      },
      handler: async (request, reply) => {
         const { start, end } = request.query;
         const results = [];
         const dataFilePath = path.join(__dirname, '../../data/data.csv');

         return new Promise((resolve, reject) => {
            fs.createReadStream(dataFilePath)
               .pipe(csv())
               .on('data', (data) => {
                  console.log(data.timestamp)
                  if (new Date(data.timestamp) >= new Date(start) && new Date(data.timestamp) <= new Date(end)) {
                     results.push(data);
                  }
               })
               .on('end', () => {
                  reply.send(results);
                  resolve();
               })
               .on('error', (err) => {
                  reply.status(500).send({ error: 'Error reading CSV file', message: err.message });
                  reject(err);
               });
         });
      }
   });
};

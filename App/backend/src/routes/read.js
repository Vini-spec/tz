const fs = require('fs');
const { request } = require('http');
const csv = require('csv-parser');
const path = require('path');

module.exports = async function (fastify, options) {
   fastify.get('/data', async (request, reply) => {
      const results = [];
      const dataFilePath = path.join(__dirname, '../../data/data.csv');

      if(!dataFilePath){
        
        reply.status(404).send('')
        return;
      }
      console.log(dataFilePath);
      return new Promise((resolve, reject) => {
        if (!fs.existsSync(dataFilePath)) {
            const err = new Error('File not found');
            reply.status(404).send({ error: 'File not found', message: err.message });
            return reject(err);
          }
         fs.createReadStream(dataFilePath)
             .pipe(csv())
             .on('data', (data) => results.push(data))
             .on('end', () => {
                 reply.send(results);
                 resolve(); 
             })
             .on('error', (err) => {
                 reply.status(500).send({ error: 'Error reading CSV file', message: err.message });
                 reject(err); 
             });
     });
   });
};
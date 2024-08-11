const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');



module.exports = async function (fastify, options) {

   fastify.post('/upload', async (req, reply) => {
      const parts = req.parts();

      for await (const part of parts) {
         if (part.file) {
            const filePath = path.join(__dirname, '../../data/data.csv');
            await saveFile(part, filePath);

            try {
               const data = await parseCSV(filePath);
               reply.send({ message: 'File uploaded successfully', data });
            } catch (err) {
               reply.status(500).send({ error: 'Failed to parse CSV file', details: err.message });
            }
         } else {
            reply.status(400).send({ error: 'No file uploaded' });
         }
      }
   });

   
   const saveFile = (part, filePath) => {
      return new Promise((resolve, reject) => {
         const writeStream = fs.createWriteStream(filePath);

         part.file.pipe(writeStream);

         writeStream.on('close', resolve);
         writeStream.on('error', reject);
      });
   };

   const parseCSV = (filePath) => {
      return new Promise((resolve, reject) => {
         const results = [];
         fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (err) => reject(err));
      });
   };
};
const path = require('path');
const fs = require('fs');

const checkDirectory = async ()=> {
   return new Promise((resolve,reject) => {
      fs.stat(path.join(__dirname, 'project-dist', 'bundle.css'),(error) => {
         if (!error) {
            fs.rm(path.join(__dirname, 'project-dist', 'bundle.css'),(error) => {
               if (error) {
                  return reject(error.message);
               }
               resolve()
            });
         } else {
            resolve()
         }
      })
   })
}
checkDirectory().then(() => {
   fs.readdir(path.join(__dirname, 'styles'),(error,files) => {
   if (error) {
      throw error;
   }
   for (let file of files) {
      if (path.extname(file) !== '.css') {
         continue;
      }
      const readStream = fs.createReadStream(path.resolve(__dirname, 'styles', file));
      readStream.on('data',(chunk) => {
         fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), chunk, (error) => {
            if (error) {
               throw error;
            }
         });
      })
      }
   })
})
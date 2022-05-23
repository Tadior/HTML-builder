const fs = require('fs');
const path = require('path');

const checkDirectory = async () => {
   return new Promise((resolve, reject) => {
      fs.stat(path.join(__dirname, 'files-copy'), (error) => {
         if (!error) {
            fs.rm(path.join(__dirname, 'files-copy'), {
               recursive: true
            }, (error) => {
               if (error) {
                  return reject(error.message);
               }
               resolve();
            });
         } else {
            resolve();
         }
      })
   })
}
checkDirectory().then(() => {
   fs.mkdir(path.resolve(__dirname, 'files-copy'), {recursive: true} ,(error) => {
      if (error) {
         throw new Error(error)
      }
   })
   
   fs.readdir(path.join(__dirname, 'files'), (error, files) => {
      if (error) {
         throw new Error(error)
      }
      files.forEach(element => {
         fs.writeFile(path.join(__dirname, 'files-copy', element), '' , (error) => {
            if (error) {
               throw new Error(error)
            }
         })
   
         const readStream = fs.createReadStream(path.join(__dirname, 'files', element));
   
         readStream.on('data', (chunk) => {
            fs.appendFile(path.join(__dirname, 'files-copy', element), chunk, (error) => {
               if (error) {
                  throw new Error(error)
               }
            })
         })
      })
   })
})

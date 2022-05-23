const path = require('path');
const fs = require('fs');
const fsPromise = require('fs/promises');
const {resolve} = require('path');
const tags = [];
const getTags = () => {
   fs.readFile(path.resolve(__dirname, 'template.html'), {encoding: 'utf8'}, (error, data) => {
      if (error) {
         throw error;
      }
      let regExp = /\{{([^}]+)\}}/g;
      let matches = data.match(regExp);
      for(let item of matches) {
         tags.push(item.slice(2, item.length - 2))
      }
   })
}
getTags();
const checkDirectory = async () => {
   return new Promise((resolve, reject) => {
      fs.stat(path.join(__dirname, 'project-dist'), (error) => {
         if (!error) {
            fs.rm(path.join(__dirname, 'project-dist'), {
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

checkDirectory().then(async () => {
   await fs.mkdir(path.resolve(__dirname, 'project-dist'), {
      recursive: true
   }, (error) => {
      if (error) {
         throw error;
      }
   })
   // Сборка Html
   await fs.readFile(path.resolve(__dirname, 'template.html'), (error, data) => {
      if (error) {
         throw error;
      }
      let template = data.toString();
      async function parse() {
         for (let tag of tags) {
            if (template.includes(`{{${tag}}}`)) {
               await fsPromise.readFile(path.resolve(__dirname, 'components', `${tag}.html`), (error, data) => {
                  if (error) {
                     throw error;
                  }
                  resolve(data.toString())
               }).then(data => {
                  template = template.replace(`{{${tag}}}`, data.toString())
               })
            }
         }
         return template;
      }
      parse().then(data => {
         fs.writeFile(path.resolve(__dirname, 'project-dist', 'index.html'), data, (error) => {
            if (error) {
               throw error;
            }
         })
      })
   })
   // Объединение стилей
   await fs.readdir(path.resolve(__dirname, 'styles'), (error, files) => {
      if (error) {
         throw error;
      }
      for (let file of files) {
         const extname = path.extname(file).slice(1, file.length)
         if (extname !== 'css') {
            continue;
         }
         const readStream = fs.createReadStream(path.resolve(__dirname, 'styles', file), {
            encoding: 'utf8'
         });
         readStream.on('data', (chunk) => {
            fs.appendFile(path.resolve(__dirname, 'project-dist', 'style.css'), chunk, (error) => {
               if (error) {
                  throw error;
               }
            })
         })
      }
   })

   // Создание папки assets
   await fs.readdir(path.resolve(__dirname, 'assets'), (error, dirs) => {
      if (error) {
         throw error;
      }
      for (let dir of dirs) {
         fs.readdir(path.resolve(__dirname, 'assets', dir), (error, files) => {
            if (error) {
               throw error;
            }
            // Создание папки assets
            fs.mkdir(path.resolve(__dirname, 'project-dist', 'assets', dir), {
               recursive: true
            }, (error) => {
               if (error) {
                  throw error;
               }
            })
            // Копирование файлов 
            for (let file of files) {
               fs.readFile(path.resolve(__dirname, 'assets', dir, file), (error, data) => {
                  if (error) {
                     throw error;
                  }
                  fs.writeFile(path.resolve(__dirname, 'project-dist', 'assets', dir, file), data, (error) => {
                     if (error) {
                        throw error;
                     }
                  })
               })
            }
         })
      }
   })
})
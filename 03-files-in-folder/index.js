const {readdir} = require('fs/promises');
const path = require('path');
const {stat} = require('fs')
const {stdin, stdout} = require('process')

async function info() {
   const files = await readdir(path.resolve(__dirname, 'secret-folder'), {withFileTypes: true})
   const checked = [];
   for (let file of files) {
      if (file.isFile()) {
         checked.push(path.parse(file.name))
      }
   }
   for (let item of checked) {
      stat(path.resolve(__dirname, 'secret-folder', item.base), (err, stats) => {
         const size = stats.size;
         stdout.write(`${item.name} - ${item.ext.slice(1, item.ext.length)} - ${size} bytes \n`)
      })
   }
}
info();

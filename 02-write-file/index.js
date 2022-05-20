const fs = require('fs');
const path = require('path');
const process = require('process');
const {
   stdin,
   stdout
} = require('process');

// Создание потока записи в текстовый файл 
const stream = fs.createWriteStream(path.resolve(__dirname, 'text.txt'), (error) => {
   if (error) {
      throw error;
   }
});
stdout.write('Добрый день, введите текст\n');
stdin.on('data', data => {
   
   if (data.toString().trim() === 'exit') {
      stdout.write('Good bye');
      process.exit();
   }
   
   stream.write(data);

})
const fs = require('fs');
const path = require('node:path');
const stream = fs.createReadStream(path.join(__dirname, 'text.txt'));

stream.once('data', (data) => console.log(data.toString()));
const fs = require('fs');

const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn);

const textOut = `This is what we know about Avocado : ${textIn}. \n Created on ${Date.now()} `;
// console.log(textOut);
fs.writeFileSync('./txt/output.txt', textOut)
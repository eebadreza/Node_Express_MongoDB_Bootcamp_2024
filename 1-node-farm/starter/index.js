const fs = require('fs');

const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn);

const textOut = `This is what we know about Avocado : ${textIn}. \n Created on ${Date.now()} `;
// console.log(textOut);
// fs.writeFileSync('./txt/output.txt', textOut)

fs.readFile('./txt/stadwert.txt', 'utf-8', (err, data1) => {

    if (err) {
        return console.log('*** ERROR ***');
    }

    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log('data2 :\t', data2);
        fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
            console.log('data3 :\t', data3);
            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, (err) => {
                console.log('File has been written!!');
            })
        })
    })
})
console.log('Reading File !!');
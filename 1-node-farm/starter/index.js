const fs = require('fs');

// File Handeling
///////////////////////////////////////////////////////////////

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn);

// const textOut = `This is what we know about Avocado : ${textIn}. \n Created on ${Date.now()} `;
// console.log(textOut);
// fs.writeFileSync('./txt/output.txt', textOut)

// fs.readFile('./txt/stadwert.txt', 'utf-8', (err, data1) => {

//     if (err) {
//         return console.log('*** ERROR ***');
//     }

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log('data2 :\t', data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log('data3 :\t', data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, (err) => {
//                 console.log('File has been written!!');
//             })
//         })
//     })
// })
// console.log('Reading File !!');

const https = require('http');
// const { text } = require('stream/consumers');
const url = require('url');
const slugify = require('slugify');

// Server Handeling
///////////////////////////////////////////////////////////////
const replaceTemplate = require('./modules/replaceTemplate');
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
// console.log(slugs);

const server = https.createServer((req, res) => {
  const { query, pathname: pathName } = url.parse(req.url, true);
  // Overview or Homepage
  if (pathName === '/' || pathName === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardHtml = dataObj.map((el) => replaceTemplate(templateCard, el)).join('');
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
    res.end(output);
  }
  // Product Page
  else if (pathName === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    // console.log(query);
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);

    res.end(output);
  }
  // API
  else if (pathName === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    // console.log(dataObj);
    res.end(data);
  }
  // Not Found Page
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hiii',
    });
    res.end('<h2>404 : Page not found !</h2>');
  }
});

server.listen(1234, '127.0.0.1', () => {
  console.log('server @ 1234');
});

const fs = require('fs');
const superagent = require('superagent');

const readMyFile = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
      //   console.log(data);
      if (err) {
        reject('404 - File not Found !');
      }
      resolve(data);
    });
  });
};

readMyFile(`${__dirname}/dog.txt`)
  .then((data) => {
    return data;
  })
  .then((data) => {
    return superagent
      .get(`https://dog.ceo/api/breed/${data}/images/random`)
      .then((res) => {
        // console.log(res.body.message);
        return res.body.message;
      })
      .then((msg) => {
        return fs.writeFile(`${__dirname}/dog-image.txt`, msg, (err) => {
          if (err) {
            // console.error(err.message);
            return err.message;
          }
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
    //   console.log(info);
  });

// fs.readFile(`${__dirname}/dog.txt`, async function (errr, data) {
//   console.log(`Breed : ${data}`);
// Method 1
////////////////////////////////////////////////////////////
//   superagent.get(
//     `https://dog.ceo/api/breed/${data}/images/random`
//   ).end((err, res) => {
//   if (err) {
//     console.error(err.message);
//     return;
//   }
//   //   console.log(res.body);

//   fs.writeFile("dog-image.txt", res.body.message, (err) => {
//     console.log("Random Dog Picture added to file!!");
//   });
// });

// Method 2
////////////////////////////////////////////////////////////
//   const daa = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   console.log(daa._body.message);

// Method 3
////////////////////////////////////////////////////////////
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       console.log(res._body.message);
//       return res._body.message;
//     })
//     .then((res) => {
//       fs.writeFile('dog-image.txt', res, (err) => {
//         console.log('Random Dog Picture added to file!!');
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });

// Method 4
////////////////////////////////////////////////////////////
// });

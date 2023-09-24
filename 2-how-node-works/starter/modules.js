// console.log(arguments);
// console.log(require('module').wrapper);

////////////////////////////////////////////////////

const C1 = require('./test-module-1.js');
// const calc = new C1();
// console.log(calc.mul(10, 2));

const { add, mul, sub } = require('./test-module-2.js');
console.log(mul(2, 3));

// Caching
const C2 = require('./test-module-3.js');
C2();
C2();
C2();

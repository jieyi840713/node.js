//require為模組的引入
const {Person,f1} = require('./person');
const Person2 = require('./person'); 
const p1 = new Person('David', 23);

console.log(p1);
console.log(''+p1);
p1.name = 'Bill';
console.log(p1.toJSON());
console.log(f1(6));

// console.log(Person === Person2);
//定義類別
class Person{
    //建構函示
    constructor(name = "noname", age = 20){
        this.name = name;
        this.age = age;
    }
    toJSON(){
    console.log('----toJSON');
    return JSON.stringify({
        name: this.name,
        age: this.age,
    })
    }
    toString(){
        console.log('----toString');
        return this.toJSON();
    }
}

console.log('----1');
// console.log(p1);
// console.log(''+p1);
// console.log(p1.toJSON());

//module.exports為模組的匯出
module.exports = {
    Person,
    f1: a => a*a
}
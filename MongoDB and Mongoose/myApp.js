require('dotenv').config();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
let Person;

const Schema = mongoose.Schema;

const personSchema = new Schema({
    name: {type:String, required:true},
    age: Number,
    favoriteFoods: [String]
});

Person = mongoose.model('Person',personSchema);

const createAndSavePerson = (done) => {
    var manishSwami = new Person({
        name:"Manish Swami",
        age:19,
        favoriteFoods: ["Idli","Dosa"]
    });
    manishSwami.save((err,data)=>{
        if(err) return console.error(err);
    done(null , data);
    });
};

const createManyPeople = (arrayOfPeople, done) => {
    Person.create(arrayOfPeople,(err,data)=>{
        if(err) return console.error(err);
    done(null , data);
    });
};

const findPeopleByName = (personName, done) => {
    Person.find({name: personName},(err,data)=>{
        if(err) return console.error(err);
        console.log(data);
    done(null , data);
    });
};

const findOneByFood = (food, done) => {
    Person.findOne({favoriteFoods: food},(err,data)=>{
        if(err) return console.error(err);
        console.log(data);
    done(null , data); 
    });
};

const findPersonById = (personId, done) => {
    Person.findOne({_id: personId},(err,data)=>{
        console.log(data);
        if(err) return console.error(err);
    done(null, data);
    });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findOne({_id: personId},(err,data)=>{
        if(err) return console.error(err);
        data.favoriteFoods.push(foodToAdd);
        data.save((err,data)=>{
            if(err) return console.error(err);
            done(null, data);
        });
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
//     Person.findOne({name: personName}, { new: true },(err,data)=>{
//         if(err) return console.error(err);
//         data.age = ageToSet;
//   done(null , data);
//     });
    Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {new: true}, (err, updatedDoc) => {
    if(err) return console.log(err);
    done(null, updatedDoc);
  });
};

const removeById = (personId, done) => {
    Person.findByIdAndRemove(personId,(err,data)=>{
        if (err) return console.error(err);
    done(null , data);
    });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
    Person.remove({name:nameToRemove},(err,data)=>{
        if (err) return console.error(err);
    done(null,data);
    });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
    Person.find({favoriteFoods:foodToSearch})
          .sort({name:0}) //sort by name
          .limit(2) //limit by 2
          .select({age:0}) //hiding the age
          .exec((err,data)=>{
              if (err) return console.error(err);
            done(null , data);
          });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;

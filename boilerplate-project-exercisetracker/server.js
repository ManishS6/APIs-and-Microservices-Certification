require('dotenv').config();
const express = require('express');
const app = express();
const mongodb = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');
const uri = process.env.MONGO_URI;
require('dotenv').config()
var mongoose = require('mongoose');
const { RSA_NO_PADDING } = require('constants');
mongoose.connect(uri,{
  useUnifiedTopology:true,
  useNewUrlParser: true
});

let User;
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  date: String,
  duration: Number,
  description: String
}, { _id : false });

const userSchema = new Schema({
  username: String,
  count: Number,
  log: [exerciseSchema]
});

User = mongoose.model('User',userSchema);

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(bodyParser.urlencoded({extended:false}));

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});

app.post('/api/exercise/new-user',async (req,res)=>{
  const username = req.body.username;
  try {
    const usernameStatus = await User.findOne({
      username:username
    });
    if(usernameStatus){
      return res.send("Username already taken");
    } else {
      let New = new User({ username: username,count:0 });
      await New.save();
      return res.json({
        username: New.username,
        _id: New._id
      })
    }
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/exercise/users", (req, res, next) => {
  User.find({})
  .exec((err, users) => {
    if (err) next(new Error(err))
    res.json(users)
  })
})

app.post("/api/exercise/add",async (req,res)=>{
  userId=req.body.userId;
  description=req.body.description;
  duration=req.body.duration;
  if(req.body.date){
    date=req.body.date;
  } else {
    var today = new Date();
    var one = today.getFullYear();
    var two = today.getMonth() < 10 ? "0"+(today.getMonth()+1) : (today.getMonth()+1);
    var three = today.getDate() < 10 ? "0"+today.getDate() : today.getDate();
    date = one+"-"+two+"-"+three;
  }
  try{
    const useridStatus = await User.findOne({
      _id:userId
    });
    if(useridStatus){
      console.log(useridStatus);
      var newLog = {date,duration,description};
      useridStatus.log.unshift(newLog)
      var nc = useridStatus.count+1;
      useridStatus.count = nc;
      useridStatus.save();
      return res.json({
        _id:useridStatus._id,
        username:useridStatus.username,
        date:useridStatus.log[0].date,
        duration:useridStatus.log[0].duration,
        description:useridStatus.log[0].description
      })
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json('Server error...');
  }
})

app.get("/api/exercise/log",async (req,res)=>{
  try{
    userId = req.query.userId;
    from = req.query.from;
    to = req.query.to;
    limit = req.query.limit;
    const usernameStatus = await User.findOne({
      _id:userId
    });
    let answer = {
      _id: usernameStatus._id,
      username: usernameStatus.username,
      count: usernameStatus.count,
      log: usernameStatus.log
    };
    if(usernameStatus){
      // if(from){
      //   for(d in usernameStatus.log){
      //     var a = new Date(usernameStatus.log[d].date);
      //     var filtered = answer.log.filter(function(value, index, arr){ 
      //       return date > a;
      //     });
      //     return res.json(filtered);
      //   }
      //   if(to){
      //     for(d in answer.log){
      //       if(answer.log.date.getTime() > Date )
      //     }
      //   }
      //   return res.json({answer})
      // }
      return res.json({usernameStatus})
    } else {
      return res.status(500).json('userId not found');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json('Server error...');
  }
})
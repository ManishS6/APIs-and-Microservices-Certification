var express = require('express');
var app = express();
var bodyParser = require('body-parser');
console.log("Hello World");
// app.get("/",function(req,res){
//     res.send("Hello Express");
// });
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});
var path = __dirname + "/public";

app.use(express.static(path));

app.use(function middleware(req,res,next){
    var a = req.method;
    var b = req.path;
    var c = req.ip;
    console.log(a+" "+b+" "+"-"+" "+c);
    next();
});

app.get("/json", function (req, res) {
    
    if(process.env.MESSAGE_STYLE === "uppercase"){
        res.json({ 
        message: "HELLO JSON"
        });
    } else {
        res.json({
            message: "Hello json"
        });
    }
});

app.get("/now",function(req,res,next){
    // middleware function
    req.time = new Date().toString();
    next();
},function(req,res){
    res.json({
        time: req.time
    })
});

app.get("/:word/echo",function(req,res){
    res.json({
        echo: req.params.word
    });
});

// app.get("/name",function(req,res,next){
//         firstname = req.query.first;
//         lastname = req.query.last;
//         next();
// },function(req,res){
//     res.json({
//         name: `${firstname} ${lastname}`
//     })
// });

app.use(bodyParser.urlencoded({extended:false}));

app.post("/name",function(req,res,next){
        firstname = req.body.first;
        lastname = req.body.last;
        next();
},function(req,res){
    res.json({
        name: `${firstname} ${lastname}`
    })
});























module.exports = app;

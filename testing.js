var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var multer = require('multer');
var path=require('path');
var fs = require('fs');
var app = express();



const image = require('./routes/imageRoutes');
// app.use(cors());

app.listen(3000,(err)=>{
    console.log("Server started at port 3000");
});
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

mongoose.connect('mongodb://localhost:27017/Image',{ useUnifiedTopology: true,useNewUrlParser: true  }, function(err){
if(err)
{ 
    throw err;
}    
console.log('Db Connected at port 27017');
});

var storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'uploads');
    },
    filename : function(req,file,cb){
        cb(null, file.fieldname +'-'+Date.now() +path.extname(file.originalname) );

    }
})

var upload = multer({
    storage : storage
})

app.post('/uploadFile', upload.single('myFile'), (req,res,next)=>{
    const file = req.file;

    if(!file)
        {
            const error = new Error("Please upload a file");
            error.httpStatusCode =400;
            return next(error);
        }
        else
        {
            res.send(file);
        }
})





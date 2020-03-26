const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
var fs = require('fs');
var mongoose = require('mongoose');
var path = require('path');

mongoose.connect('mongodb://localhost:27017/Image',{ useUnifiedTopology: true,useNewUrlParser: true  }, function(err){
if(err)
{ 
    throw err;
}    
console.log('Db Connected at port 27017');
});

const app = express();

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Request-With, x-access-token, x-refresh-token, Content-Type, Accept, _id");
    res.header("Access-Control-Expose-Headers", "x-access-token, x-refresh-token");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

app.listen(3000,()=>{
    console.log('Server Running on Port 3000');
})

const storage = multer.diskStorage({
    destination : (req,file,callback)=>{
        callback(null,'uploads')
    },
    filename : (req,file,callback)=>{
        callback(null, file.originalname )
    }
})
var upload = multer({storage : storage});
app.get("/", (req,res)=>{
    res.send("Its working");
})

app.post('/file',upload.single('file'), (req,res)=>{

    if(!req.file)
    {
        res.json("No File is Recieved");
    }
    else
    {
        let file = req.file;
        console.log("File Uploaded "+file.filename);
        
        var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');


    //define a json object for the image
    var finalImg ={
        contentType : req.file.mimetype,
        path : req.file.path,
        image : new Buffer(encode_image,'base64')
    };



    //inserting image to db
    var collection=mongoose.connection.db.collection('image');
    collection.insertOne(finalImg,(err,docs)=>{
        if(err)
            console.log(err)
        else
           {
            console.log("File Saved At DB");
           } 
        
    })
    res.send(file.filename);
     }
    
    
   // console.log(file.filename);
})

app.get('/file/:imgurl',(req,res)=>{
    res.sendFile(req.params.imgurl, {root : './uploads/'});
})

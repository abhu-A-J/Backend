const express = require("express");
const bodyParser=require("body-parser");
const formidable = require("formidable");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const resultInformation = require("./data");
app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.get("/*", (req, res) => {
    res.send("404! Not found");
});


app.post("/file_upload", (req, res, next) => {
    
    const form = formidable({ multiples: true, uploadDir: __dirname, keepExtensions:true});
    
    var fileName, fileType;
    
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
         
        fileName = files.file.name;
        fileType = files.file.type;
        
        let runPy = new Promise(function (success, nosuccess) {

            const { spawn } = require('child_process');

            

            const pyprog = spawn('python', ['label_images.py','./plant.jpg']);

            pyprog.stdout.on('data', function (data) {
                success(data);
            });

            pyprog.stderr.on('data', (data) => {
                nosuccess(data);
            });
        });

        runPy.then(result => {
            console.log(result.toString());

        })
        .catch(err => {
                console.log("Error from spawn", err)
        })
       
    });
    
    
    
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
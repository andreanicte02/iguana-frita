var express = require('express');
var router = express.Router();
const formidable = require("formidable");
var fs = require('fs');
var paths = require('path')


router.get('/', function(req, res, next) {
    res.render('upload-file', { err: 'Express' });
});

router.post('/', (req, res) => {

    var posibleError = null;

    new formidable.IncomingForm().parse(req)
        .on('field', (name, field) => {
            console.log('Field', name, field)
        })
        .on('fileBegin', (name, file) => {
            const path = __dirname + '/../public/archivos/' + file.name;
            if (paths.extname(path) === ""){
                if (!fs.existsSync(path))
                    fs.mkdirSync(path, { recursive: true });
            }
            else {

                const folderPath = path.substring(0, path.lastIndexOf("/"));
                if (!fs.existsSync(folderPath))
                    fs.mkdirSync(folderPath, { recursive: true });
            }

            file.path = path;
        })
        .on('file', (name, file) => {
            // console.log('Uploaded file', name, file)
            console.log('Uploaded file', file.path)
        })
        .on('aborted', () => {
            console.error('Request aborted by the user')
        })
        .on('error', (err) => {
            console.error('Error', err)
            // throw err
            posibleError = err;
        })
        .on('end', () => {
            res.render('upload-file', { err: posibleError });
            // res.end()
        })

});

module.exports = router;

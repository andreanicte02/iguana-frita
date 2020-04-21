var express = require('express');
var router = express.Router();
const dirTree = require("directory-tree");


router.get('/', function(req, res, next) {

    const path = __dirname + '/../public/archivos/'
    const tree = dirTree(path);

    res.json(tree);

});


module.exports = router;

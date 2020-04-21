var express = require('express');
var router = express.Router();

var fs = require('fs');
var paths = require('path')




router.post('/', (req, res) => {
    fs.writeFileSync(req.body.path, req.body.content);
    res.send("todo bien");
});

module.exports = router;

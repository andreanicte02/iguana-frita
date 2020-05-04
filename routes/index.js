var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {

    res.render('index', { title : "Express"}) //view es la vista
});

module.exports = router;
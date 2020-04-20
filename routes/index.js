"use strict";
var express_1 = require("express");
var Principal_1 = require("../public/javascripts/ts/jsharp/Principal");
var router = express_1.Router();
router.get('/', function (req, res, next) {
    var example = new Principal_1.Principal();
    example.testParser();
    res.render('index', { title: "Express" }); //view es la vista
});
module.exports = router;
//# sourceMappingURL=index.js.map
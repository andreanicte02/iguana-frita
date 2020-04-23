"use strict";
var express_1 = require("express");
var router = express_1.Router();
router.get('/', function (req, res, next) {
    res.render('index', { title: "Express" }); //view es la vista
});
module.exports = router;
//# sourceMappingURL=index.js.map
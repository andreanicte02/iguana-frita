import { Router } from 'express';
let router = Router();
router.get('/', function (req, res, next) {
    res.render('index', { title: "Express" }); //view es la vista
});
//# sourceMappingURL=index.js.map
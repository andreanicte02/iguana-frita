
import { Router } from 'express';
import { Principal } from "../public/javascripts/ts/jsharp/Principal";

const router: Router = Router();

router.get('/', function (req, res, next) {
    let example = new Principal();
    example.testParser();
    res.render('index', { title : "Express"}) //view es la vista
});


export = router;
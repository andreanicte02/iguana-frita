let parser = require('../../parser/parser');

class Principal {

    constructor() {

    }

    testParser():void{
        try {
            let e = parser.parse("3+3*3")

        }catch (e) {

        }
    }

}

export {Principal};

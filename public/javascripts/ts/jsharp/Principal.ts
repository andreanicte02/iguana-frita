let parser = require('../../parser/Parser');

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

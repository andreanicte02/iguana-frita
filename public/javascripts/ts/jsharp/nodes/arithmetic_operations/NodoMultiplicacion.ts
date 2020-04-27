import {BinaryOperations} from "../BinaryOperations";
import {FileLocation} from "../FileLocation";
import {NodoAst} from "../NodoAst";

export class NodoMultiplicacion extends BinaryOperations{

    constructor(fileLocation: FileLocation, e1: NodoAst, e2: NodoAst) {
        super(fileLocation, e1, e2,"*");
    }


}
import {NodoAstPro} from "./NodoAst.js";
import {ZAmbito} from "../types/ZAmbito.js";
import {Codigo} from "./Codigo.js";
import {codigoAsignar} from "../types/codigos.js";
import {FileLocation} from "./FileLocation.js";


class NodoAsignar extends NodoAstPro {
    private c1: Codigo;
    private c2: Codigo;

    constructor(fileLocation: FileLocation, c1: Codigo, c2: Codigo) {
        super(fileLocation);
        this.c1 = c1;
        this.c2 = c2;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        return codigoAsignar(this.c1, this.c2);
    }

}
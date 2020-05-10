import {NodoAst, NodoAstPro} from "./NodoAst.js";
import {ZAmbito} from "../types/ZAmbito.js";
import {Codigo} from "./Codigo.js";
import {FileLocation} from "./FileLocation.js";
import {desenvolver} from "../Utilidades.js";
import { codigoAccessoIndice } from "../types/codigos.js";


export class NodoAccessoArray extends NodoAstPro {
    private e1: NodoAst;
    private e2: NodoAst;


    constructor(fileLocation: FileLocation, e1: NodoAst, e2: NodoAst) {
        super(fileLocation);
        this.e1 = e1;
        this.e2 = e2;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const codigoArreglo = desenvolver(this.e1.generarCodigo(ambito));
        const codigoIndice = desenvolver(this.e2.generarCodigo(ambito));
        return codigoAccessoIndice(codigoArreglo, codigoIndice);
    }

}
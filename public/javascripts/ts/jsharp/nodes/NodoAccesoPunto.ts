import {NodoAst, NodoAstPro} from "./NodoAst.js";
import {ZAmbito} from "../types/ZAmbito.js";
import {Codigo} from "./Codigo.js";
import {FileLocation} from "./FileLocation.js";
import {codigoObtenerPropiedad} from "../types/codigos.js";
import {desenvolver} from "../Utilidades.js";


export class NodoAccesoPunto extends NodoAstPro {
    private nombreAtributo: string;
    private e1: NodoAst;

    constructor(fileLocation: FileLocation, e1: NodoAst, nombreAtributo: string) {
        super(fileLocation);
        this.e1 = e1;
        this.nombreAtributo = nombreAtributo;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const codigoDireccionInstancia = desenvolver(this.e1.generarCodigo(ambito));
        return codigoObtenerPropiedad(codigoDireccionInstancia, this.nombreAtributo);
    }
}
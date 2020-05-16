import {NodoAstPro} from "./NodoAst.js";
import {FileLocation} from "./FileLocation.js";
import {Codigo} from "./Codigo.js";
import {codigoObtenerVar} from "../types/codigos.js";
import {ZAmbito} from "../types/ZAmbito.js";


export class NodoObtenerVar extends NodoAstPro {
    public readonly nombre: string;

    constructor(fileLocation: FileLocation, nombre: string) {
        super(fileLocation);
        this.nombre = nombre;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        return codigoObtenerVar(ambito, this.nombre);
    }
}
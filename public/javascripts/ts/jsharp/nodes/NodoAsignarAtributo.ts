import {NodoAst, NodoAstPro} from "./NodoAst.js";
import {FileLocation} from "./FileLocation.js";
import { Codigo } from "./Codigo.js";
import { ZAmbito } from "../types/ZAmbito.js";
import {codigoAsignar, codigoObtenerVar} from "../types/codigos.js";
import {desenvolver} from "../Utilidades.js";

/**
 * Estos nodos son utilizados para crear un constructor
 */
export class NodoAsignarAtributo extends NodoAstPro {
    private nombre: string;
    private nodoValor: NodoAst;

    constructor(fileLocation: FileLocation, nombre: string, nodoValor: NodoAst) {
        super(fileLocation);
        this.nombre = nombre;
        this.nodoValor = nodoValor;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const codigoVar = codigoObtenerVar(ambito, this.nombre);
        const codigoValor = desenvolver(this.nodoValor.generarCodigo(ambito));
        return codigoAsignar(codigoVar, codigoValor);
    }

}
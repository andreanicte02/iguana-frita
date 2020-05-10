import {NodoAst, NodoAstPro} from "./NodoAst.js";
import {ZAmbito} from "../types/ZAmbito.js";
import {Codigo} from "./Codigo.js";
import {FileLocation} from "./FileLocation.js";
import {desenvolver} from "../Utilidades.js";
import {codigoCrearArray} from "../types/codigos.js";


export class NodoCrearArray extends NodoAstPro {
    private nodoObtenerTipo: NodoAst;
    private nodoValor: NodoAst;

    constructor(fileLocation: FileLocation, nodoObtenerTipo: NodoAst, nodoValor: NodoAst) {
        super(fileLocation);
        this.nodoObtenerTipo = nodoObtenerTipo;
        this.nodoValor = nodoValor;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const { tipo } = this.nodoObtenerTipo.generarCodigo(ambito);
        const codigoValor = desenvolver(this.nodoValor.generarCodigo(ambito));
        return codigoCrearArray(tipo, codigoValor);
    }

}
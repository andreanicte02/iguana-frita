import {NodoAst, NodoAstPro} from "./NodoAst.js";
import {ZAmbito} from "../types/ZAmbito.js";
import {Codigo} from "./Codigo.js";
import {FileLocation} from "./FileLocation.js";
import {deBooleanoEtiquetaANormalCondicional} from "./TypeDefinition.js";
import {desenvolver} from "../Utilidades.js";
import {codigoCrearArrayConValores} from "../types/codigos.js";


export class NodoCrearArrayConValores extends NodoAstPro {
    private nodosValor: NodoAst[];

    constructor(fileLocation: FileLocation, nodosValor: NodoAst[]) {
        super(fileLocation);
        this.nodosValor = nodosValor;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const codigosArgumento = this.nodosValor
            .map(n => deBooleanoEtiquetaANormalCondicional(desenvolver(n.generarCodigo(ambito))));
        return codigoCrearArrayConValores(codigosArgumento);
    }

}
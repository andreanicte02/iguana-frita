import {NodoAstPro} from "./NodoAst.js";
import {ZAmbito} from "../types/ZAmbito.js";
import {Codigo} from "./Codigo.js";
import {FileLocation} from "./FileLocation.js";
import {codigoCrearString} from "../types/codigos.js";


export class NodoCrearString extends NodoAstPro {
    private readonly texto: string;

    constructor(fileLocation: FileLocation, texto: string) {
        super(fileLocation);
        this.texto = texto;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        return codigoCrearString(ambito, this.texto);
    }

}
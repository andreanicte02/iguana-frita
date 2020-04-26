import {Codigo} from "./Codigo.js";
import {FileLocation} from "./FileLocation.js";
import {ZAmbito} from "../types/ZAmbito.js";

export interface NodoAst {
    generarCodigo(ambito: ZAmbito): Codigo;
}

export abstract class NodoAstPro implements NodoAst {
    private readonly fileLocation: FileLocation;

    constructor(fileLocation: FileLocation) {
        this.fileLocation = fileLocation;
    }

    generarCodigo(ambito: ZAmbito): Codigo {
        // TODO: manejo correcto de errores como en el proyecto pasado
        return this.generacionSeguraDeCodigo(ambito);
    }

    public abstract generacionSeguraDeCodigo(ambito: ZAmbito): Codigo;
}

import {Codigo} from "./Codigo.js";
import {FileLocation} from "./FileLocation.js";
import {ZAmbito} from "../types/ZAmbito.js";
import {SemanticError} from "../types/SemanticError";
import {LocatedSemanticException} from "../types/LocatedSemanticException";

export interface NodoAst {
    generarCodigo(ambito: ZAmbito): Codigo;
}

export abstract class NodoAstPro implements NodoAst {
    private readonly fileLocation: FileLocation;

    constructor(fileLocation: FileLocation) {
        this.fileLocation = fileLocation;
    }

    generarCodigo(ambito: ZAmbito): Codigo {

        try{
            return this.generacionSeguraDeCodigo(ambito);
        }catch (e) {
            throw new LocatedSemanticException(e.message,this.fileLocation);
        }

    }

    public abstract generacionSeguraDeCodigo(ambito: ZAmbito): Codigo;
}

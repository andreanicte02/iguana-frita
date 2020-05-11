import { NodoAstPro } from "./NodoAst.js";
import { FileLocation } from "./FileLocation.js";
import { Codigo } from "./Codigo.js";
import {nTipoEntero, nTipoNull} from "../types/TiposPrimitivos.js";
import { ZAmbito } from "../types/ZAmbito.js";

export class NodoCrearNull extends NodoAstPro {


    constructor(fileLocation: FileLocation) {
        super(fileLocation);

    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const codigo = new Codigo();
        codigo.tipo = nTipoNull;
        codigo.apuntador = `0`;
        codigo.extra = `null`;
        return codigo;
    }
}

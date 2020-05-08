
import { NodoAstPro } from "./NodoAst.js";
import { Codigo } from "./Codigo.js";
import { nTipoVoid } from "../types/TiposPrimitivos.js";
import { ZAmbito } from "../types/ZAmbito.js";

export class NodoObtenerTipoVoid extends NodoAstPro {
    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const codigo = new Codigo();
        codigo.tipo = nTipoVoid;
        return codigo;
    }
}
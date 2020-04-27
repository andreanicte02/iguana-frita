import { NodoAstPro } from "./NodoAst.js";
import { Codigo } from "./Codigo.js";
import { nTipoEntero } from "../types/TiposPrimitivos.js";
import { ZAmbito } from "../types/ZAmbito.js";

export class NodoObtenerTipoInt extends NodoAstPro {
  generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
    const codigo = new Codigo();
    codigo.tipo = nTipoEntero;
    return codigo;
  }
}

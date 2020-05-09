import { NodoAstPro } from "./NodoAst.js";
import { Codigo } from "./Codigo.js";
import { nTipoBooleanNormal, nTipoChar, nTipoDouble, nTipoEntero} from "../types/TiposPrimitivos.js";
import { ZAmbito } from "../types/ZAmbito.js";

export class NodoObtenerTipoInteger extends NodoAstPro {
  generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
    const codigo = new Codigo();
    codigo.tipo = nTipoEntero;
    return codigo;
  }
}

export class NodoObtenerTipoDouble extends NodoAstPro{
  generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
    const codigo = new Codigo();
    codigo.tipo = nTipoDouble;
    return codigo;
  }
}

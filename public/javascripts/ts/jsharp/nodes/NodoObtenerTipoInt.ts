import { NodoAstPro } from "./NodoAst.js";
import { Codigo } from "./Codigo.js";
import {nTipoBoolean, nTipoChar, nTipoDouble, nTipoEntero} from "../types/TiposPrimitivos.js";
import { ZAmbito } from "../types/ZAmbito.js";

export class NodoObtenerTipoInt extends NodoAstPro {
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

export class NodoObtenerTipoBoolean extends NodoAstPro{

  generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
    const codigo = new Codigo();
    codigo.tipo = nTipoBoolean;
    return codigo;
  }

}

export class NodoObtenerTipoChar extends NodoAstPro{

  generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
    const codigo = new Codigo();
    codigo.tipo = nTipoChar;
    return codigo;
  }

}

//boleanas
//int
//char
//asdfsd



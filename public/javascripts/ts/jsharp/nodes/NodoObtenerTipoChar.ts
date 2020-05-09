import {NodoAstPro} from "./NodoAst";
import {ZAmbito} from "../types/ZAmbito";
import {Codigo} from "./Codigo";
import {nTipoChar} from "../types/TiposPrimitivos";
import {FileLocation} from "./FileLocation";

export class NodoObtenerTipoChar extends NodoAstPro{

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const codigo = new Codigo();
        codigo.tipo = nTipoChar;
        return codigo;
    }

}
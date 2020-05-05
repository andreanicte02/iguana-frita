import {NodoAstPro} from "./NodoAst";
import { ZAmbito } from "../types/ZAmbito";
import { Codigo } from "./Codigo";
import {nTipoBooleanNormal} from "../types/TiposPrimitivos";

export class NodoCrearFalse extends NodoAstPro{


    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const codigo = new Codigo();
        codigo.tipo = nTipoBooleanNormal;
        codigo.apuntador = `0`;

        return codigo;
    }
    
}
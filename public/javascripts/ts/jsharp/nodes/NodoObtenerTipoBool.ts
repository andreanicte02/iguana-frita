import {NodoAst, NodoAstPro} from "./NodoAst";
import {ZAmbito} from "../types/ZAmbito";
import {Codigo} from "./Codigo";
import {nTipoBooleanNormal} from "../types/TiposPrimitivos";
import {FileLocation} from "./FileLocation";

export class NodoObtenerTipoBool extends NodoAstPro{

    constructor(fileLocation: FileLocation, e1: NodoAst, e2: NodoAst) {
        super(fileLocation);
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const codigo = new Codigo();
        codigo.tipo = nTipoBooleanNormal;
        return codigo;
    }

}
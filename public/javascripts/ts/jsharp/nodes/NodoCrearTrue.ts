import {NodoAstPro} from "./NodoAst";
import { Codigo } from "./Codigo";
import { ZAmbito } from "../types/ZAmbito";
import {FileLocation} from "./FileLocation";
import {generarEtiqueta} from "../Utilidades";
import {nTipoBooleanNormal} from "../types/TiposPrimitivos";

export class NodoCrearTrue extends NodoAstPro{

    constructor(fileLocation: FileLocation) {
        super(fileLocation);
    }


    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const  codigo = new Codigo();
        codigo.tipo = nTipoBooleanNormal;
        codigo.apuntador = `1`;
        return codigo;
    }

}
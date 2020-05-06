import {NodoAst, NodoAstPro} from "./NodoAst.js";
import {ZAmbito} from "../types/ZAmbito.js";
import {Codigo} from "./Codigo.js";
import {codigoAsignar} from "../types/codigos.js";
import {FileLocation} from "./FileLocation.js";
import {desenvolver} from "../Utilidades";
import {nTipoBooleanConEtiqueta} from "../types/TiposPrimitivos";
import {deBooleanoEtiquetaANormal} from "./TypeDefinition";


//linea 2016
//en lugar de
export class NodoAsignar extends NodoAstPro {
    private c1: NodoAst;
    private c2: NodoAst;

    constructor(fileLocation: FileLocation, c1: NodoAst, c2: NodoAst) {
        super(fileLocation);
        this.c1 = c1;
        this.c2 = c2;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const codigo1 = this.c1.generarCodigo(ambito);
        const codigo2 = desenvolver(this.c2.generarCodigo(ambito));

        //paso de boleans etiquetas a bollean normal si es que existe
        return codigoAsignar(codigo1,codigo2);
    }

}
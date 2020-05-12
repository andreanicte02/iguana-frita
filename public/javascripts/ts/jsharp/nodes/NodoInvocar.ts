import {NodoAst, NodoAstPro} from "./NodoAst.js";
import { Codigo } from "./Codigo.js";
import { ZAmbito } from "../types/ZAmbito.js";
import {FileLocation} from "./FileLocation.js";
import {codigoInvocar} from "../types/codigos.js";
import {desenvolver} from "../Utilidades.js";
import { deBooleanoEtiquetaANormalCondicional } from "./TypeDefinition.js";


export class NodoInvocar extends NodoAstPro {
    private nombreFuncion: string;
    private nodosArgumento: NodoAst[];


    constructor(fileLocation: FileLocation, nombreFuncion: string, nodosArgumento: NodoAst[]) {
        super(fileLocation);
        this.nombreFuncion = nombreFuncion;
        this.nodosArgumento = nodosArgumento;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const codigosArgumento = this.nodosArgumento
            .map(n => deBooleanoEtiquetaANormalCondicional(desenvolver(n.generarCodigo(ambito))));
        return codigoInvocar(ambito, this.nombreFuncion, codigosArgumento);
    }

}

export class NodoInvocacionPunto extends NodoAstPro {
    private e1: NodoAst;
    private nombreFuncion: string;
    private nodosArgumento: NodoAst[];

    constructor(fileLocation: FileLocation, e1: NodoAst, nombreFuncion: string, nodosArgumento: NodoAst[]) {
        super(fileLocation);
        this.e1 = e1;
        this.nombreFuncion = nombreFuncion;
        this.nodosArgumento = nodosArgumento;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const argumento = deBooleanoEtiquetaANormalCondicional(desenvolver(this.e1.generarCodigo(ambito)))
        const codigosArgumento = this.nodosArgumento
            .map(n => deBooleanoEtiquetaANormalCondicional(desenvolver(n.generarCodigo(ambito))));
        return codigoInvocar(ambito, this.nombreFuncion, [argumento, ...codigosArgumento], false, true);
    }

}
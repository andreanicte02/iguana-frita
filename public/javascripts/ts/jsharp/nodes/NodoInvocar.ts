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
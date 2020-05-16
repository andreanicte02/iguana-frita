import {NodoAst, NodoAstPro} from "./NodoAst.js";
import { Codigo } from "./Codigo.js";
import { ZAmbito } from "../types/ZAmbito.js";
import {FileLocation} from "./FileLocation.js";
import {buscarEnCadenaAmbito, codigoInvocar} from "../types/codigos.js";
import {desenvolver} from "../Utilidades.js";
import { deBooleanoEtiquetaANormalCondicional } from "./TypeDefinition.js";
import {codigoCrearEntero} from "./NodoCrearInteger.js";
import {nTipoBooleanNormal, nTipoEntero} from "../types/TiposPrimitivos.js";
import {NodoObtenerVar} from "./NodoObtenerVar.js";
import {SemanticError} from "../types/SemanticError.js";
import {NTipo} from "../types/NTipo.js";


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

        if (this.nombreFuncion.toLowerCase() === 'size' && this.nodosArgumento.length === 0) {
            const codigo = new Codigo();
            codigo.tipo = nTipoEntero;
            codigo.apuntador = `${argumento.tipo.ambito?.espacioEnMemoria || 0}`;
            codigo.extra = `${argumento.tipo.nombre}.size() => ${codigo.apuntador}`;
            return codigo;
        }

        if (this.nombreFuncion.toLowerCase() === 'getreference' && this.nodosArgumento.length === 0) {
            const codigo = new Codigo();
            codigo.agregarCodigo(argumento);
            codigo.tipo = nTipoEntero;
            codigo.apuntador = argumento.apuntador;
            codigo.extra = `(int)(*${argumento.extra})`;
            return codigo;
        }

        if (this.nombreFuncion.toLowerCase() === 'instanceof' && this.nodosArgumento.length === 1) {
            const nodoNombreTipo = this.nodosArgumento[0];
            if (!(nodoNombreTipo instanceof NodoObtenerVar))
                throw new SemanticError(`Se tiene que suministrar el nombre del tipo directamente en la funcion instanceOf`);
            const nombreTipo = nodoNombreTipo.nombre;
            const nTipo = buscarEnCadenaAmbito<NTipo>(ambito, a => a.buscarTipo(nombreTipo));
            if (nTipo === undefined) {
                throw new SemanticError(`No se encontro el tipo ${nombreTipo}`);
            }
            const valor = argumento.tipo === nTipo? 1 : 0;
            const codigo = new Codigo();
            codigo.tipo = nTipoBooleanNormal;
            codigo.apuntador = `${valor}`;
            codigo.comentar(`${codigo.tipo.nombre} === ${nTipo.nombre} --> ${valor}`);
            codigo.extra = `${codigo.tipo.nombre} === ${nTipo.nombre}`;
            return codigo;
        }


        const codigosArgumento = this.nodosArgumento
            .map(n => deBooleanoEtiquetaANormalCondicional(desenvolver(n.generarCodigo(ambito))));
        return codigoInvocar(ambito, this.nombreFuncion, [argumento, ...codigosArgumento], false, true);
    }

}

export class NodiInvocarSayajin extends NodoAstPro{

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
        return codigoInvocar(ambito, this.nombreFuncion, codigosArgumento, false, true);
    }

    
}
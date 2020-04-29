import {NTipo, NTipoVar} from "./NTipo.js";
import {NodoAst} from "../nodes/NodoAst.js";
import {ZAmbito} from "./ZAmbito.js";

export class NFuncion {

    public static readonly RETURN = 'return';

    public readonly ambito: ZAmbito;
    public readonly tipoRetorno: NTipo;
    public readonly sentencias: NodoAst[];

    constructor(ambitoPadre: ZAmbito, tipoRetorno: NTipo, nodosParametro: NodoAst[], sentencias: NodoAst[]) {
        this.ambito = new ZAmbito(ambitoPadre);
        this.tipoRetorno = tipoRetorno;
        this.sentencias = sentencias;

        // se declara en la tabla de simbolos el 'return' y los parametros
        this.ambito.declararPropiedad(NFuncion.RETURN, new NTipoVar(tipoRetorno));
        nodosParametro.forEach(nodoParametro => {
            nodoParametro.generarCodigo(this.ambito);
        })
    }

    obtenerFirmaTipos(): string {
        const entradas = this.ambito.obtenerEntradas();
        const nombreTipos = entradas.map(([, valor]) => valor.tipoContenido.nombre);
        return nombreTipos.join('_');
    }

}
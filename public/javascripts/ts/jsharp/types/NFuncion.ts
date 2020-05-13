import {NTipo, NTipoVar} from "./NTipo.js";
import {NodoAst} from "../nodes/NodoAst.js";
import {ZAmbito} from "./ZAmbito.js";
import {Codigo} from "../nodes/Codigo.js";
import {codigoGenerarBloque, generarEtiqueta} from "../Utilidades.js";
import {nTipoVoid} from "./TiposPrimitivos.js";

export class NFuncion {

    public static readonly RETURN = 'return';
    public static readonly INSTANCIA = '@instancia';

    public readonly ambito: ZAmbito;
    public readonly tipoRetorno: NTipo;
    public readonly sentencias: NodoAst[];

    constructor(ambitoPadre: ZAmbito, tipoRetorno: NTipo, nodosParametro: NodoAst[], sentencias: NodoAst[], esConstructor: boolean) {
        this.ambito = new ZAmbito(ambitoPadre, true);
        this.tipoRetorno = esConstructor? nTipoVoid: tipoRetorno;
        this.sentencias = sentencias;

        // se declara en la tabla de simbolos el 'return'
        if (tipoRetorno !== nTipoVoid) {
            this.ambito.declararPropiedad(NFuncion.RETURN, new NTipoVar(tipoRetorno));
        }

        // cuando la funcion es un constructor, siempre va a recibir como unico parametro una instancia del mismo tipo
        if (esConstructor) {
            this.ambito.declararPropiedad(NFuncion.INSTANCIA, new NTipoVar(tipoRetorno));
        }

        // se declaran los parametros
        nodosParametro.forEach(nodoParametro => {
            nodoParametro.generarCodigo(this.ambito);
        })

        this.parametrosTipos = this.ambito.obtenerEntradas()
            .filter(([nombre,]) => nombre !== NFuncion.RETURN)
            .map(([, valor]) => valor.tipoContenido);

        this.nombresParametro = this.ambito.obtenerEntradas()
            .filter(([nombre,]) => nombre !== NFuncion.RETURN)
            .map(([nombre,]) => nombre);
    }

    public readonly parametrosTipos: NTipo[];
    public readonly nombresParametro: string[];

    /**
     * Solo genera el codigo que esta dentro del bloque de la funcion
     * No genera la parte de
     * proc <id> begin
     * end
     */
    public generarCodigo(): Codigo {
        this.ambito.etiquetaFinFuncion = generarEtiqueta();
        const codigo = new Codigo();
        const codigoBloque = codigoGenerarBloque(this.sentencias, this.ambito);
        codigo.agregarCodigo(codigoBloque);
        codigo.agregar(`${this.ambito.etiquetaFinFuncion}:`);
        codigo.agregar(`end`);
        codigo.agregarCodigo(this.ambito.generarCodigoFunciones());
        return codigo;
    }

}
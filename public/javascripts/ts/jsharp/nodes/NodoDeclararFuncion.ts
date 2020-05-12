import {NodoAst, NodoAstPro} from "./NodoAst.js";
import {ZAmbito} from "../types/ZAmbito.js";
import {Codigo} from "./Codigo.js";
import {FileLocation} from "./FileLocation.js";
import {NFuncion} from "../types/NFuncion.js";
import {generarNombreProc, obtenerTipoDesdeBancoArray} from "../Utilidades.js";


export class NodoDeclararFuncion extends NodoAstPro {
    private readonly nodoTipoRetorno: NodoAst;
    private readonly nombre: string;
    private readonly nodosParametro: NodoAst[];
    private readonly sentencias: NodoAst[];
    private readonly esArray: boolean;
    private readonly especial: boolean;

    constructor(
        fileLocation: FileLocation,
        nodoTipoRetorno: NodoAst,
        nombre: string,
        nodosParametro: NodoAst[],
        sentencias: NodoAst[],
        esArray = false,
        especial = false
    ) {
        super(fileLocation);
        this.nodoTipoRetorno = nodoTipoRetorno;
        this.nombre = nombre;
        this.nodosParametro = nodosParametro;
        this.sentencias = sentencias;
        this.esArray = esArray;
        this.especial = especial;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const { tipo } = this.nodoTipoRetorno.generarCodigo(ambito);

        const tipoRetorno = this.esArray? obtenerTipoDesdeBancoArray(tipo): tipo;
        const nFuncion = new NFuncion(ambito, tipoRetorno, this.nodosParametro, this.sentencias, false);
        /*
        Para soportar sobrecarga de funciones, ejemplo:
        hola(int a){}       --> hola_INT
        hola(bool z, int c) --> hola_BOOL_INT
         */
        const nombreProc = generarNombreProc(this.nombre, nFuncion.obtenerParametrosTipos(), this.especial);
        ambito.declararFuncion(nombreProc, nFuncion);

        // Las funciones solo se declaran, el contenido de ellas se genera despues
        /*
        Explicacion:

        void uno() {
            ...
            dos()
            ...
        }
        void dos(){
            ...
            uno();
            ...
        }

        Si se genera sobre la marcha toda la funcion, cuando se genere la funcion `uno`,
        no encontrara a la funcion `dos` la cual se invoca en su cuerpo.

        Si solo se declaran primero todas las funciones, y hasta despues se generan el codigo de las funciones
        no tendra problema, por que `dos` ya estara declarado
         */
        return Codigo.vacio;
    }

}
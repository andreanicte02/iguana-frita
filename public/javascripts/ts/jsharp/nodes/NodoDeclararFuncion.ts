import {NodoAst, NodoAstPro} from "./NodoAst.js";
import {ZAmbito} from "../types/ZAmbito.js";
import {Codigo} from "./Codigo.js";
import {FileLocation} from "./FileLocation.js";
import {NFuncion} from "../types/NFuncion.js";


export class NodoDeclararFuncion extends NodoAstPro {
    private readonly nodoTipoRetorno: NodoAst;
    private readonly nombre: string;
    private readonly nodosParametro: NodoAst[];
    private readonly sentencias: NodoAst[];

    constructor(
        fileLocation: FileLocation,
        nodoTipoRetorno: NodoAst,
        nombre: string,
        nodosParametro: NodoAst[],
        sentencias: NodoAst[]
    ) {
        super(fileLocation);
        this.nodoTipoRetorno = nodoTipoRetorno;
        this.nombre = nombre;
        this.nodosParametro = nodosParametro;
        this.sentencias = sentencias;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const { tipo } = this.nodoTipoRetorno.generarCodigo(ambito);
        const nFuncion = new NFuncion(ambito, tipo, this.nodosParametro, this.sentencias, false);
        /*
        Para soportar sobrecarga de funciones, ejemplo:
        hola(int a){}       --> hola_INT
        hola(bool z, int c) --> hola_BOOL_INT
         */
        const firma = `fun_${this.nombre}_${nFuncion.obtenerFirmaTipos()}`;
        ambito.declararFuncion(firma, nFuncion);

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
import {NodoAst, NodoAstPro} from "./NodoAst.js";
import {FileLocation} from "./FileLocation.js";
import {Codigo} from "./Codigo.js";
import {ZAmbito} from "../types/ZAmbito.js";
import {NTipoVar} from "../types/NTipo.js";


export class NodoDeclararParametro extends NodoAstPro {
    private nodoObtenerTipo: NodoAst;
    private nombre: string;

    constructor(fileLocation: FileLocation, nodoObtenerTipo: NodoAst, nombre: string) {
        super(fileLocation);
        this.nodoObtenerTipo = nodoObtenerTipo;
        this.nombre = nombre;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const codigoTipo = this.nodoObtenerTipo.generarCodigo(ambito) ;
        if (codigoTipo.tipo === undefined) {
            throw new Error('Nodo suministrado no posee tipo');
        }
        ambito.declararPropiedad(this.nombre, new NTipoVar(codigoTipo.tipo));
        return Codigo.vacio;
    }
}
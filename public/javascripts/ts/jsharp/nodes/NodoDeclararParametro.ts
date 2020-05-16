import {NodoAst, NodoAstPro} from "./NodoAst.js";
import {FileLocation} from "./FileLocation.js";
import {Codigo} from "./Codigo.js";
import {ZAmbito} from "../types/ZAmbito.js";
import {NTipoVar} from "../types/NTipo.js";
import {guardarTablaFunciones, obtenerTipoDesdeBancoArray} from "../Utilidades.js";


export class NodoDeclararParametro extends NodoAstPro {
    private nodoObtenerTipo: NodoAst;
    private nombre: string;
    private esArray: boolean;

    constructor(fileLocation: FileLocation, nodoObtenerTipo: NodoAst, nombre: string, esArray = false) {
        super(fileLocation);
        this.nodoObtenerTipo = nodoObtenerTipo;
        this.nombre = nombre;
        this.esArray = esArray;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const codigoTipo = this.nodoObtenerTipo.generarCodigo(ambito) ;
        if (codigoTipo.tipo === undefined) {
            throw new Error('Nodo suministrado no posee tipo');
        }

        const tipo = this.esArray? obtenerTipoDesdeBancoArray(codigoTipo.tipo): codigoTipo.tipo;
        ambito.declararPropiedad(this.nombre, new NTipoVar(tipo));

        //
        guardarTablaFunciones(this.nombre,tipo.nombre,this.getX(), this.getY(), this.getPath(),
            'parametro',-1,this.esArray+'')
        //
        return Codigo.vacio;
    }
}
import {NodoAst, NodoAstPro} from "./NodoAst.js";
import { Codigo } from "./Codigo.js";
import { ZAmbito } from "../types/ZAmbito.js";
import {FileLocation} from "./FileLocation.js";
import {NTipoVar} from "../types/NTipo.js";
import {guardarTablaSimbolos, obtenerTipoDesdeBancoArray} from "../Utilidades.js";
import {esBoleano} from "./TypeDefinition";


export class NodoDeclararAtributo extends NodoAstPro {
    private nodoObtenerTipo: NodoAst;
    private nombre: string;
    private esArray = false;

    constructor(fileLocation: FileLocation, nodoObtenerTipo: NodoAst, nombre: string, esArray = false) {
        super(fileLocation);
        this.esArray = esArray;
        this.nodoObtenerTipo = nodoObtenerTipo;
        this.nombre = nombre;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const codigoTipo = this.nodoObtenerTipo.generarCodigo(ambito) ;
        if (codigoTipo.tipo === undefined) {
            throw new Error('Nodo suministrado no posee tipo');
        }
        const tipoContenido = this.esArray? obtenerTipoDesdeBancoArray(codigoTipo.tipo): codigoTipo.tipo;
        ambito.declararPropiedad(this.nombre, new NTipoVar(tipoContenido));

        guardarTablaSimbolos(this.nombre, codigoTipo.tipo.nombre,this.getY(), this.getX(), this.getPath(), this.esArray+ '');

        return Codigo.vacio;
    }

}

import {NodoAst, NodoAstPro} from "./NodoAst.js";
import {FileLocation} from "./FileLocation.js";
import {Codigo} from "./Codigo.js";
import {NTipoVar} from "../types/NTipo.js";
import {ZAmbito} from "../types/ZAmbito.js";

export class NodoDeclararVar extends NodoAstPro {
    private readonly nombre: string;
    private readonly nodoObtenerTipo: NodoAst;

    constructor(fileLocation: FileLocation, nombre: string, nodoObtenerTipo: NodoAst) {
        super(fileLocation);
        this.nombre = nombre;
        this.nodoObtenerTipo = nodoObtenerTipo;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const codigoTipo = this.nodoObtenerTipo.generarCodigo(ambito);
        if (codigoTipo.tipo === undefined) {
            // ojo: este no es un SemanticError, se lanza para proteger durante desarrollo
            throw new Error('Nodo suministrado no posee tipo');
        }

        ambito.declararPropiedad(this.nombre, new NTipoVar(codigoTipo.tipo));

        // TODO: devolver la posicion de la variable declarada;
        return Codigo.vacio;
    }

}
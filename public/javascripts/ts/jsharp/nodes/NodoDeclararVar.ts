import {NodoAst, NodoAstPro} from "./NodoAst.js";
import {FileLocation} from "./FileLocation.js";
import {Codigo} from "./Codigo.js";
import {NTipoVar} from "../types/NTipo.js";
import {ZAmbito} from "../types/ZAmbito.js";

export class NodoDeclararVar extends NodoAstPro {
    private readonly nombre: string;
    private nodoObtenerTipo: NodoAst | undefined;

    constructor(fileLocation: FileLocation, nombre: string) {
        super(fileLocation);
        this.nombre = nombre;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        if(this.nodoObtenerTipo === undefined){
            return Codigo.vacio;
        }
        
        const codigoTipo = this.nodoObtenerTipo.generarCodigo(ambito) ;

        if (codigoTipo.tipo === undefined) {
            // ojo: este no es un SemanticError, se lanza para proteger durante desarrollo
            throw new Error('Nodo suministrado no posee tipo');
        }
        //solo un declaraicon

        ambito.declararPropiedad(this.nombre, new NTipoVar(codigoTipo.tipo));

        // TODO: devolver la posicion de la variable declarada;
        return Codigo.vacio;
    }

    definirTipo(nodoObtenerTipo: NodoAst): void{

        this.nodoObtenerTipo = nodoObtenerTipo;

    }

}

///odo que represente la declacion de una o varias variables

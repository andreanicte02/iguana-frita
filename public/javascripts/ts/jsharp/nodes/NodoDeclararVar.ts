import {NodoAst, NodoAstPro} from "./NodoAst.js";
import {FileLocation} from "./FileLocation.js";
import {Codigo} from "./Codigo.js";
import {NTipoVar} from "../types/NTipo.js";
import {ZAmbito} from "../types/ZAmbito.js";
import {obtenerTipoDesdeBancoArray} from "../Utilidades.js";
import {codigoAsignar} from "../types/codigos";

export class NodoDeclararVar extends NodoAstPro {
    public readonly nombre: string;
    private nodoObtenerTipo: NodoAst | undefined;
    private esArray: boolean | undefined;
    private clean = false;

    constructor(fileLocation: FileLocation, nombre: string) {
        super(fileLocation);
        this.nombre = nombre;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        if(this.nodoObtenerTipo === undefined){
            throw new Error(`Estas ejecutando esto sin haber definido 'nodoObtenerTipo'`);
        }
        
        const codigoTipo = this.nodoObtenerTipo.generarCodigo(ambito) ;

        if (codigoTipo.tipo === undefined) {
            // ojo: este no es un SemanticError, se lanza para proteger durante desarrollo
            throw new Error('Nodo suministrado no posee tipo');
        }
        
        const tipoContenido = this.esArray? obtenerTipoDesdeBancoArray(codigoTipo.tipo): codigoTipo.tipo;
        ambito.declararPropiedad(this.nombre, new NTipoVar(tipoContenido));

        return Codigo.vacio;
    }

    definirTipo(nodoObtenerTipo: NodoAst, esArray: boolean): void{

        this.nodoObtenerTipo = nodoObtenerTipo;
        this.esArray = esArray;

    }

}

///odo que represente la declacion de una o varias variables

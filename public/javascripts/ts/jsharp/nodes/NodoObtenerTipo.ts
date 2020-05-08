import {NodoAstPro} from "./NodoAst.js";
import {FileLocation} from "./FileLocation.js";
import { ZAmbito } from "../types/ZAmbito.js";
import { Codigo } from "./Codigo.js";
import {codigoObtenerTipo} from "../types/codigos.js";


export class NodoObtenerTipo extends NodoAstPro {
    private readonly nombre: string;

    constructor(fileLocation: FileLocation, nombre: string) {
        super(fileLocation);
        this.nombre = nombre;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        return codigoObtenerTipo(ambito, this.nombre);
    }
}
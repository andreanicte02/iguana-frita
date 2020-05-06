import {NodoAst, NodoAstPro} from "./NodoAst.js";
import {Codigo} from "./Codigo.js";
import { ZAmbito } from "../types/ZAmbito.js";
import {FileLocation} from "./FileLocation.js";
import {NTipo} from "../types/NTipo.js";
import {NFuncion} from "../types/NFuncion.js";


export class NodoDeclararEstructura extends NodoAstPro {
    private nombre: string;
    private pares: { declaracion: NodoAst; asignacion: NodoAst }[];

    constructor(
        fileLocation: FileLocation,
        nombre: string,
        pares: { declaracion: NodoAst; asignacion: NodoAst }[]
    ) {
        super(fileLocation);
        this.nombre = nombre;
        this.pares = pares;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        // se declara el tipo
        const declaraciones = this.pares.map(p => p.declaracion);
        // la variable nTipo representa a la estructura (en el lenguaje J#)
        const nTipo = new NTipo(this.nombre, declaraciones);
        ambito.declararTipo(this.nombre, nTipo);

        // se declara el constructor
        const asignaciones = this.pares.map(p => p.asignacion).filter(a => a);
        const nFuncion = new NFuncion(ambito, nTipo, [], asignaciones, true);
        ambito.declararFuncion(`init_${this.nombre}`, nFuncion);

        return Codigo.vacio;
    }
}
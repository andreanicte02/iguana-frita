import {NodoAst} from "./nodes/NodoAst.js";
import {ZAmbito} from "./types/ZAmbito.js";
import {Codigo} from "./nodes/Codigo.js";

export { NodoObtenerTipoInt, NodoObtenerTipoBoolean,NodoObtenerTipoChar, NodoObtenerTipoDouble } from './nodes/NodoObtenerTipoInt'
export { NodoCrearInt } from './nodes/NodoCrearInt';
export { FileLocation } from './nodes/FileLocation' ;
export { NodoDeclararVar } from  './nodes/NodoDeclararVar'
export { NodoDeclararVarTipo5 } from  './nodes/NodoDeclararVarTipo5'

export function generar3d(sentencias: NodoAst[]): string {

    const ambito = new ZAmbito(undefined);

    const codigo = new Codigo();

    codigo.agregar(`var H, P;`);
    codigo.agregar(`P = 0;`);
    codigo.agregar(`H = 0;`);
    sentencias
        .map(sentencia => sentencia.generarCodigo(ambito))
        .forEach(c => {
            codigo.agregarCodigo(c)
        });

    return codigo.texto;
}
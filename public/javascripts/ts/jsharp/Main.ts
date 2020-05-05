import {NodoAst} from "./nodes/NodoAst.js";
import {ZAmbito} from "./types/ZAmbito.js";
import {Codigo} from "./nodes/Codigo.js";
import {FileLocation} from "./nodes/FileLocation.js";

export { NodoObtenerTipoInt,NodoObtenerTipoChar, NodoObtenerTipoDouble } from './nodes/NodoObtenerTipoInt'
export { NodoObtenerTipoBool } from './nodes/NodoObtenerTipoBool';
export { NodoCrearInt } from './nodes/NodoCrearInt';
export { NodoCrearTrue } from './nodes/NodoCrearTrue';
export { NodoCrearFalse } from './nodes/NodoCrearFalse';

export { FileLocation } from './nodes/FileLocation' ;
export { NodoDeclararVar } from  './nodes/NodoDeclararVar';
export { NodoDeclararVarTipo5 } from  './nodes/NodoDeclararVarTipo5';

export { NodoSuma } from './nodes/arithmetic_operations/NodoSuma';

export {NodoRelacional} from './nodes/NodoRelacional';

export { NodoAsignar } from './nodes/NodoAsignar';
export { NodoObtenerVar } from './nodes/NodoObtenerVar';
export { NodoNot } from './nodes/NodoNot';
export { NodoOr } from './nodes/NodoOr';
export { NodoAnd } from './nodes/NodoAnd';


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

// Nos va a ayudar a crear el FileLocation de manera mas simplificada
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fl(yy: any, pos: any): FileLocation {
    const filePath = 'path';
    const x = pos.first_column;
    const y = pos.first_line;
    return new FileLocation(filePath, x, y);
}
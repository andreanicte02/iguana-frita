import {NodoAst} from "./nodes/NodoAst.js";
import {ZAmbito} from "./types/ZAmbito.js";
import {Codigo} from "./nodes/Codigo.js";
import {FileLocation} from "./nodes/FileLocation.js";
import {codigoGenerarBloque} from "./Utilidades.js";
import { NTipoVar } from "./types/NTipo.js";
import {nTipoVoid} from "./types/TiposPrimitivos.js";
import {codigoInvocar} from "./types/codigos.js";

export { NodoObtenerTipoInteger,NodoObtenerTipoChar, NodoObtenerTipoDouble } from './nodes/NodoObtenerTipoInteger.js'
export { NodoObtenerTipoBool } from './nodes/NodoObtenerTipoBool';
export { NodoCrearInteger } from './nodes/NodoCrearInteger';
export { NodoCrearTrue } from './nodes/NodoCrearTrue';
export { NodoCrearFalse } from './nodes/NodoCrearFalse';
export { NodoDeclararParametro } from './nodes/NodoDeclararParametro';
export { FileLocation } from './nodes/FileLocation' ;
export { NodoDeclararVar } from  './nodes/NodoDeclararVar';
export { NodoDeclararVarTipo5 } from  './nodes/NodoDeclararVarTipo5';
export { NodoDeclararVarTipo1 } from './nodes/NodoDeclararVarTipo1';
export { NodoSuma } from './nodes/arithmetic_operations/NodoSuma';
export { NodoResta } from './nodes/arithmetic_operations/NodoResta';
export { NodoMulti } from './nodes/arithmetic_operations/NodoMulti';
export { NodoModular } from  './nodes/arithmetic_operations/NodoModular';
export { NodoUnarioMenos } from  './nodes/arithmetic_operations/NodoUnarioMenos';
export { NodoInvocar } from './nodes/NodoInvocar';
export { NodoRelacional } from './nodes/NodoRelacional';
export { NodoObtenerTipoVoid } from './nodes/NodoObtenerTipoVoid';
export { NodoAsignar } from './nodes/NodoAsignar';
export { NodoObtenerVar } from './nodes/NodoObtenerVar';
export { NodoDeclararFuncion } from './nodes/NodoDeclararFuncion';


export { NodoAsignarAtributo } from './nodes/NodoAsignarAtributo';
export { NodoDeclararAtributo } from './nodes/NodoDeclararAtributo';
export { NodoDeclararEstructura } from './nodes/NodoDeclararEstructura';
export { NodoNot } from './nodes/NodoNot';
export { NodoOr } from './nodes/NodoOr';
export { NodoAnd } from './nodes/NodoAnd';
export { NodoXor } from './nodes/NodoXor';


export { NodoIf } from './nodes/control_sentences/NodoIf';

export function generar3d(sentencias: NodoAst[]): string {

    const codigo = new Codigo();
    codigo.agregar(`var H, P;`);
    codigo.agregar(`P = 1;`); // comenzamos desde 1, por que el 0 se toma como null a la hora de manejar referencias
    codigo.agregar(`H = 1;`); // comenzamos desde 1, por que el 0 se toma como null a la hora de manejar referencias
    codigo.agregar('//');
    const ambito = new ZAmbito(undefined);
    const codigoAmbitoGlobal = codigoGenerarBloque(sentencias, ambito);
    console.log(ambito);
    codigo.agregarCodigo(codigoAmbitoGlobal);

    codigo.agregar('//////////////////////////////');
    codigo.agregar('// ejecucion de main');
    const codigoInvocarMain = codigoInvocar(ambito, 'main', []);
    codigo.agregarCodigo(codigoInvocarMain);
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
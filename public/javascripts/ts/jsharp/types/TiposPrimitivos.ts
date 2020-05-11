import {NTipo} from "./NTipo.js";

export const nTipoEntero = new NTipo('Integer', []);
export const nTipoDouble = new NTipo('Double', []);
//tipo boleano sombra
export const nTipoBooleanConEtiqueta = new NTipo('Boolean Etiqueta', []);
export const nTipoBooleanNormal = new NTipo('Boolean', []);
//----------------
export const nTipoNull = new NTipo('Null', []);
//----------------
export const nTipoChar = new NTipo('Char', []);
export const nTipoVoid = new NTipo('Void', []);

// tipo default en un objeto Codigo, no deberia de usarse en ningun otro lado
export const nTipoComodin = new NTipo('Tipo-Comodin', []);



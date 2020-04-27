import { NodoAst } from "../nodes/NodoAst.js";

export class NTipo {
  public readonly nombre: string;
  private readonly declaraciones: NodoAst[];

  constructor(nombre: string, declaraciones: NodoAst[] = []) {
    this.nombre = nombre;
    this.declaraciones = declaraciones;
  }
}

//es una variable del tipo que guarda andentro
export class NTipoVar extends NTipo {
  public readonly tipoContenido: NTipo;

  constructor(tipoContenido: NTipo) {
    super("NTipoVar", []);
    this.tipoContenido = tipoContenido;
  }
}

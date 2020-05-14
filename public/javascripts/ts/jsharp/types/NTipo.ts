import { NodoAst } from "../nodes/NodoAst.js";
import {ZAmbito} from "./ZAmbito.js";
import {inicio} from "../Utilidades.js";

export class NTipo {

  public readonly _nombre: string;
  private readonly declaraciones: NodoAst[];
  public ambito: ZAmbito | undefined;
  public id = ++(inicio.contadorEstructuras);

  public get nombre(): string {
    return this._nombre;
  }

  constructor(nombre: string, declaraciones: NodoAst[]) {
    this._nombre = nombre;
    this.declaraciones = declaraciones;
  }

  public declararPropiedades(ambito?: ZAmbito): void {
    const a = new ZAmbito(ambito, false);
    this.declaraciones.forEach(declaracion => {
      declaracion.generarCodigo(a);
    })
    this.ambito = a;
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

export class NTipoArreglo extends NTipo {
  public readonly tipoContenido: NTipo;

  public get nombre(): string {
    return `${this.tipoContenido.nombre}[]`;
  }

  constructor(tipoContenido: NTipo) {
    super("NTipoArreglo", []);
    this.tipoContenido = tipoContenido;
  }
}
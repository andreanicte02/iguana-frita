import { NodoAst } from "../nodes/NodoAst.js";
import {ZAmbito} from "./ZAmbito.js";
import {inicio} from "../Utilidades.js";

export class NTipo {

  public readonly _nombre: string;
  private readonly declaraciones: NodoAst[];
  public ambito: ZAmbito | undefined;
  public id = ++(inicio.contadorEstructuras);
  public isConst=false;


  public get nombre(): string {
    return this._nombre;
  }

  public get nombrePlano(): string {
    return this._nombre;
  }

  constructor(nombre: string, declaraciones: NodoAst[]) {
    this._nombre = nombre;
    this.declaraciones = declaraciones;
    this.isConst = false;
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
  public readonly accesoDirecto: string;

  constructor(tipoContenido: NTipo, accesoDirecto?: string) {
    super("NTipoVar", []);
    this.tipoContenido = tipoContenido;
    this.accesoDirecto = accesoDirecto || '';
  }
}

export class NTipoArreglo extends NTipo {
  public readonly tipoContenido: NTipo;

  public get nombre(): string {
    return `${this.tipoContenido.nombre}[]`;
  }

  public get nombrePlano(): string {
    return `${this.tipoContenido.nombre}__`;
  }

  constructor(tipoContenido: NTipo) {
    super("NTipoArreglo", []);
    this.tipoContenido = tipoContenido;
  }
}
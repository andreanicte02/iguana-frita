import { NodoAst } from "../nodes/NodoAst.js";
import {ZAmbito} from "./ZAmbito.js";
import {inicio} from "../Utilidades.js";

export class NTipo {

  public readonly nombre: string;
  private readonly declaraciones: NodoAst[];
  public ambito: ZAmbito | undefined;
  public id = inicio.contadorEstructuras++;

  constructor(nombre: string, declaraciones: NodoAst[]) {
    this.nombre = nombre;
    this.declaraciones = declaraciones;
  }

  public declararPropiedades(): void {
    const a = new ZAmbito(undefined, false);
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

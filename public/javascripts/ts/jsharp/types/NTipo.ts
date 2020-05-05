import { NodoAst } from "../nodes/NodoAst.js";
import {ZAmbito} from "./ZAmbito.js";

export class NTipo {
  public readonly nombre: string;
  private readonly declaraciones: NodoAst[];
  public readonly ambito = new ZAmbito();

  constructor(nombre: string, declaraciones: NodoAst[]) {
    this.nombre = nombre;
    this.declaraciones = declaraciones;
  }

  public declararPropiedades() {
    this.declaraciones.forEach(declaracion => {
      declaracion.generarCodigo(this.ambito);
    })
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

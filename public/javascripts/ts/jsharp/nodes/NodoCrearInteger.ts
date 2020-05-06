import { NodoAstPro } from "./NodoAst.js";
import { FileLocation } from "./FileLocation.js";
import { Codigo } from "./Codigo.js";
import { nTipoEntero } from "../types/TiposPrimitivos.js";
import { ZAmbito } from "../types/ZAmbito.js";

export class NodoCrearInteger extends NodoAstPro {
  private valor: number;

  constructor(fileLocation: FileLocation, valor: number) {
    super(fileLocation);
    this.valor = valor;
  }

  generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
    const codigo = new Codigo();
    codigo.tipo = nTipoEntero;
    codigo.apuntador = `${this.valor}`;
    codigo.extra = `${this.valor}`;
    return codigo;
  }
}

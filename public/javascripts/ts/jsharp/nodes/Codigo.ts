import { NTipo } from "../types/NTipo.js";
import { nTipoComodin } from "../types/TiposPrimitivos.js";

export class Codigo {
  // una instancia de un codigo vacio
  public static readonly vacio = new Codigo();

  // guarda el temporal utilizado
  public apuntador: string | undefined;
  // nos ayuda a generar comentarios entendibles
  public extra = "";
  // aqui guardaremos el 'acceso' a stack o heap, ejemplo: stack[t93]
  public acceso = "";

  //etiquetas verdaderas etiquetas falasas

  public eTrue: string | undefined;

  public eFalse: string | undefined;

  public eSalida: string | undefined;

  public tipo: NTipo = nTipoComodin;

  private readonly lineas: string[] = [];

  public agregarCodigo(codigo: Codigo): void {
    this.lineas.push(...codigo.lineas);
  }
  public agregar(texto: string): void {
    if (texto.trim().length === 0) {
      return;
    }
    this.lineas.push(texto);
  }

  public comentar(texto: string): void {
    let ultimaLinea = this.lineas.pop();
    if (ultimaLinea === undefined) {
      ultimaLinea = "".padEnd(25);
    }
    if (ultimaLinea.length < 25) {
      ultimaLinea = ultimaLinea.padEnd(25);
    }
    ultimaLinea += "//" + texto;
    this.lineas.push(ultimaLinea);
  }

  get texto(): string {
    return this.lineas.join("\n");
  }
}

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

  //cambiar por una lista
  public eTrue: string []=[];

  public eFalse: string []=[];


  //public eSalida: string | undefined;

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

  //metodos para agregar a las etiquetas verdaderas

  public guardarEtiquetaVerdadera(etigquetaVerdadera: string): void{
    this.eTrue.push(etigquetaVerdadera);
  }


  public guardarEtiquetaFalsa(etigquetaFalsa: string): void{
    this.eFalse.push(etigquetaFalsa);
  }

  public pasarEtiquetasVerdaderas(etiquetasV: string[]): void {

    this.eTrue.push(...etiquetasV);
  }


  public pasarEtiquetasFalsas(etiquetasF: string[]): void {

    this.eFalse.push(...etiquetasF);
  }


}

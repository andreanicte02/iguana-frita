import { NTipo } from "../types/NTipo.js";
import { nTipoComodin } from "../types/TiposPrimitivos.js";

export class GestorTemp {

  private static _temporales: string[] = [];

  public static get cantidad() {
    return GestorTemp._temporales.length;
  }

  public static agregarTemporal(temporal: string): void {
    // console.log(`agregar:`, temporal);
    if (!GestorTemp._temporales.includes(temporal)) {
      GestorTemp._temporales.push(temporal);
    }
  }
  public static usarTemporal(temporal: string): void {
    // console.log('a usar:', temporal)
    GestorTemp._temporales = GestorTemp._temporales.filter(t => t !== temporal);
  }

  public static limpiar(): void
  {
    GestorTemp._temporales = [];
  }

  public static get temporales(): string[]
  {
    return [...GestorTemp._temporales];
  }

}


export class Codigo {
  // una instancia de un codigo vacio
  public static readonly vacio = new Codigo();

  // guarda el temporal utilizado
  public apuntador = "";
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

  public agregarCodigo = (codigo: Codigo): void => {
    if (codigo === this)
      throw new Error(`El metodo agregarCodigo no debe de invocarse consigo misma`);
    this.lineas.push(...codigo.lineas);
  }
  public agregarCodigos = (codigos: Codigo[]): void => {
    codigos.forEach(this.agregarCodigo);
  }
  public agregar(texto: string, gestionarTemporal = true): void {
    if (texto.trim().length === 0) {
      return;
    }
    this.lineas.push(texto);

    if (!gestionarTemporal) return;

    // console.log(texto);

    if (texto.indexOf("if") >= 0) {
      const assignaciones: string[] = [];
      const regex1 = /t[0-9]+/gi;
      let result1: RegExpExecArray | null;
      while ((result1 = regex1.exec(texto)) ) {
        assignaciones.push(result1[0]);
      }

      assignaciones.forEach(temporal => {
          GestorTemp.usarTemporal(temporal);
      });
    }
    else if (texto.indexOf("=") >= 0) {
      const [izquierdo, derecho] = texto.split('=');

      const assignaciones: string[] = [];
      const regex1 = /t[0-9]+/gi;
      let result1: RegExpExecArray | null;
      while ((result1 = regex1.exec(izquierdo)) ) {
        assignaciones.push(result1[0]);
      }
      const operandos: string[] = [];
      const regex2 = /t[0-9]+/gi;
      let result2: RegExpExecArray | null;
      while ((result2 = regex2.exec(derecho)) ) {
        operandos.push(result2[0]);
      }

      assignaciones.forEach(temporal => {
        if (texto.startsWith('stack')){
          GestorTemp.usarTemporal(temporal);
        }
        else if(texto.startsWith('heap')) {
          GestorTemp.usarTemporal(temporal);
        }
        else {
          GestorTemp.agregarTemporal(temporal);
        }
      })
      operandos.forEach(temporal => {
        GestorTemp.usarTemporal(temporal);
      })
    }
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

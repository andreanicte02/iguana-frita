export class NombreVars {
    public nombre: string;
    public tipo: string;
    public fila: number;
    public columna: number;
    public otro: string| undefined;
    public arreglo: string;

    constructor(nombre: string,tipo: string ,fila: number,columna: number,otro: string, arreglo: string) {

        this.nombre = nombre;
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
        this.otro = otro;
        this.arreglo = arreglo;
    }

}
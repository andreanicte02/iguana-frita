export class NombreFunciones {
    public nombre: string;
    public tipo: string;
    public fila: number;
    public columna: number;
    public path: string| undefined;
    public arreglo: string;
    public rol: string;
    public cantParmetros: number;

    constructor(nombre: string,tipo: string ,fila: number,
                columna: number,path: string, arreglo: string, rol: string,
                cantParmetros: number) {

        this.nombre = nombre;
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
        this.path = path;
        this.arreglo = arreglo;
        this.rol = rol;
        this.cantParmetros = cantParmetros;

    }
    
}
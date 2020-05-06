import {NTipo, NTipoVar} from "./NTipo.js";
import {SemanticError} from "./SemanticError.js";
import {NFuncion} from "./NFuncion.js";
import { Codigo } from "../nodes/Codigo.js";


export class ZAmbito {

    private readonly tipos = new Map<string, NTipo>();
    //tipos declarados
    private readonly propiedades = new Map<string, NTipoVar>();
    private readonly funciones = new Map<string, NFuncion>();
    public readonly padre?: ZAmbito;

    // nos lleva al final de la funcion
    // solo se llena para el ambito principal al generar el codigo de una funcion
    public etiquetaFinFuncion = '';
    
    constructor(padre?: ZAmbito) {
        this.padre = padre;
    }

    public declararTipo(nombre: string, tipo: NTipo ): void {
        if (this.tipos.has(nombre.toLowerCase())) {
            throw new SemanticError(`Tipo ${nombre} ya declarado`);
        }
        this.tipos.set(nombre.toLowerCase(), tipo);
    }
    public declararPropiedad(nombre: string, tipo: NTipoVar): void {
        if (this.propiedades.has(nombre.toLowerCase())) {
            throw new SemanticError(`Propiedad ${nombre} ya declarado`);
        }
        this.propiedades.set(nombre.toLowerCase(), tipo);
    }
    public declararFuncion(nombre: string, nFuncion: NFuncion): void {
        if (this.funciones.has(nombre.toLowerCase())) {
            throw new SemanticError(`Funcion ${nombre} ya declarado`);
        }
        this.funciones.set(nombre.toLowerCase(), nFuncion);
    }

    public buscarPropiedadConDireccionRelativa(nombreBuscado: string): {indice: number; nTipoVar: NTipoVar} | undefined {
        const nTipoVar = this.propiedades.get(nombreBuscado);

        if (nTipoVar === undefined) {
            return undefined;
        }
        const nombres = [...this.propiedades.keys()];
        const indice = nombres.findIndex(
            (nombre) => nombre === nombreBuscado.toLowerCase()
        );
        return {indice, nTipoVar};
    }

    public buscarTipo(nombre: string): NTipo | undefined {
        return this.tipos.get(nombre);
    }

    public obtenerEntradas(): [string, NTipoVar][] {
        return [...this.propiedades.entries()];
    }

    public inicializarTipos(): void {
        this.tipos.forEach(value => value.declararPropiedades());
    }

    public generarCodigoFunciones(): Codigo {
        const codigo = new Codigo();
        [...this.funciones.entries()].forEach(([nombre, nFuncion]) => {
            codigo.agregar(`proc ${nombre} begin`);
            codigo.agregarCodigo(nFuncion.generarCodigo());
            codigo.agregar(`end`);
        });
        return codigo;
    }
}


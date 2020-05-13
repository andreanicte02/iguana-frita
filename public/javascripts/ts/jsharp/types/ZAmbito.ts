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
    public readonly esOrigenFuncion: boolean;
    public labelFin: string | undefined;
    public labelInicio: string | undefined;

    // nos lleva al final de la funcion
    // solo se llena para el ambito principal al generar el codigo de una funcion
    public etiquetaFinFuncion = '';

    public get espacioEnMemoria(): number {
        return this.propiedades.size;
    }
    
    constructor(padre: ZAmbito | undefined, esOrigenFuncion = false) {
        this.padre = padre;
        this.esOrigenFuncion = esOrigenFuncion;
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
        const nTipoVar = this.propiedades.get(nombreBuscado.toLowerCase());

        if (nTipoVar === undefined) {
            return undefined;
        }
        const nombres = [...this.propiedades.keys()];
        const indice = nombres.findIndex(
            (nombre) => nombre === nombreBuscado.toLowerCase()
        );
        return {indice, nTipoVar};
    }

    public buscarNFuncion(nombreProc: string): NFuncion | undefined {
        return this.funciones.get(nombreProc.toLowerCase());
    }
    public obtenerNFuncionesEntradas(): [string, NFuncion][] | undefined {
        const entradas = [...this.funciones.entries()]
        return entradas.length? entradas: undefined;
    }
    public buscarTipo(nombre: string): NTipo | undefined {
        return this.tipos.get(nombre.toLowerCase());
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
            codigo.agregar('//');
            codigo.agregar(`proc ${nombre} begin`);
            codigo.agregarCodigo(nFuncion.generarCodigo());
        });
        return codigo;
    }
}


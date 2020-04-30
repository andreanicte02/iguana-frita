import {NTipo, NTipoVar} from "./NTipo.js";
import {SemanticError} from "./SemanticError.js";
import {NFuncion} from "./NFuncion.js";


export class ZAmbito {

    private readonly tipos = new Map<string, NTipo>();
    //tipos declarados
    private readonly propiedades = new Map<string, NTipoVar>();
    private readonly funciones = new Map<string, NFuncion>();
    public readonly padre?: ZAmbito;
    
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

    public buscarPropiedadConDireccionRelativa(nombreBuscado: string): [number, NTipoVar | undefined] {
        const tipoVar = this.propiedades.get(nombreBuscado);

        if (tipoVar === undefined) {
            return [-1, undefined];
        }
        const nombres = [...this.propiedades.keys()];
        const indice = nombres.findIndex(
            (nombre) => nombre === nombreBuscado.toLowerCase()
        );
        return [indice, tipoVar];
    }

    public obtenerTipoDeclarado(nombre: string): NTipo {
        const tipoVar = this.tipos.get(nombre.toLowerCase());
        if (tipoVar === undefined) {
            throw new SemanticError(`Tipo ${nombre} no existe`);
        }
        return tipoVar;
    }

    public obtenerEntradas(): [string, NTipoVar][] {
        return [...this.propiedades.entries()];
    }
}


import {NTipo, NTipoVar} from "./NTipo.js";
import {SemanticError} from "./SemanticError.js";




class NFuncion {

}

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
        if (this.tipos.has(nombre)) {
            // TODO: es case-sensitive?
            throw new SemanticError(`Tipo ${nombre} ya declarado`);
        }
        this.tipos.set(nombre, tipo);
    }
    public declararPropiedad(nombre: string, tipo: NTipoVar): void {

        if (this.propiedades.has(nombre)) {
            // TODO: es case-sensitive?
            throw new SemanticError(`Propiedad ${nombre} ya declarado`);
        }

        this.propiedades.set(name, tipo);
    }

    public buscarPropiedadConDireccionRelativa(nombreBuscado: string): [number, NTipoVar | undefined] {
        if (!this.propiedades.has(nombreBuscado)) {
            return [-1, undefined];
        }
        const nombres = [...this.propiedades.keys()];
        const indice = nombres.findIndex(nombre => nombre === nombreBuscado);
        return [indice, this.propiedades.get(nombreBuscado)!];
    }

    public obtenerTipoDeclarado(name: string): NTipo {

        if (!this.tipos.has(name)) {
            throw new SemanticError('Tipo no existe');
        }
        return this.tipos.get(name)!;
    }
}


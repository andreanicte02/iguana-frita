import {NodoAstPro} from "./NodoAst.js";
import {ZAmbito} from "../types/ZAmbito.js";
import {Codigo} from "./Codigo.js";
import {FileLocation} from "./FileLocation.js";
import {nTipoChar} from "../types/TiposPrimitivos.js";


export function codigoCrearChar(valor: string): Codigo {
    const codigo = new Codigo();
    codigo.tipo = nTipoChar;
    codigo.apuntador = `${valor.charCodeAt(0)}`;
    codigo.extra = `${JSON.stringify(valor)}`;
    return codigo;
}

export class NodoCrearChar extends NodoAstPro {
    private valor: string;

    constructor(fileLocation: FileLocation, valor: string) {
        super(fileLocation);
        this.valor = valor;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        return codigoCrearChar(this.valor);
    }

}
import {NodoAstPro} from "./NodoAst.js";
import {ZAmbito} from "../types/ZAmbito.js";
import {Codigo} from "./Codigo.js";
import {FileLocation} from "./FileLocation.js";
import {nTipoChar} from "../types/TiposPrimitivos.js";


export class NodoCrearChar extends NodoAstPro {
    private valor: string;

    constructor(fileLocation: FileLocation, valor: string) {
        super(fileLocation);
        this.valor = valor;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const codigo = new Codigo();
        codigo.tipo = nTipoChar;
        codigo.apuntador = `${this.valor.charCodeAt(0)}`;
        codigo.extra = `${JSON.stringify(this.valor)}`;
        return codigo;
    }

}
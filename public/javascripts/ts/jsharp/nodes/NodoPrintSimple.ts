import {NodoAst, NodoAstPro} from "./NodoAst.js";
import {ZAmbito} from "../types/ZAmbito.js";
import {Codigo} from "./Codigo.js";
import {FileLocation} from "./FileLocation.js";
import {desenvolver} from "../Utilidades.js";
import {nTipoChar, nTipoDouble, nTipoEntero} from "../types/TiposPrimitivos.js";
import {SemanticError} from "../types/SemanticError.js";


export class NodoPrintSimple extends NodoAstPro {
    private letra: string;
    private e1: NodoAst;

    constructor(fileLocation: FileLocation, letra: string, e1: NodoAst) {
        super(fileLocation);
        this.letra = letra;
        this.e1 = e1;
        switch (letra) {
            case "c":
            case "e":
            case "d":
                break;
            default:
                throw new Error(`Letra '${letra}' no soportado para simplePrint`);
        }
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const codigoValor = desenvolver(this.e1.generarCodigo(ambito));
        if (!(codigoValor.tipo === nTipoChar || codigoValor.tipo === nTipoDouble || codigoValor.tipo === nTipoEntero)) {
            throw new SemanticError(`Simple print solo es apto para int, double o char, no para ${codigoValor.tipo.nombre} `);
        }
        const codigo = new Codigo();
        codigo.agregarCodigo(codigoValor);
        codigo.agregar(`print("%${this.letra}", ${codigoValor.apuntador});`);
        return codigo;
    }

}
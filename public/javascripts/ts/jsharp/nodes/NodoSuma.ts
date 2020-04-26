import {FileLocation} from "./FileLocation.js";
import {NodoAst, NodoAstPro} from "./NodoAst.js";
import {Codigo} from "./Codigo.js";
import {desenvolver, generarTemporal} from "../Utilidades.js";
import {ZAmbito} from "../types/ZAmbito.js";

export class NodoSuma extends NodoAstPro {
    private readonly e1: NodoAst;
    private readonly e2: NodoAst;

    constructor(fileLocation: FileLocation, e1: NodoAst, e2: NodoAst) {
        super(fileLocation);
        this.e1 = e1;
        this.e2 = e2;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const c1 = desenvolver(this.e1.generarCodigo(ambito));
        const c2 = desenvolver(this.e2.generarCodigo(ambito));

        const codigo = new Codigo();
        codigo.agregarCodigo(c1);
        codigo.agregarCodigo(c2);
        codigo.apuntador = generarTemporal();
        codigo.agregar(`${codigo.apuntador} = ${c1.apuntador} + ${c2.apuntador};`);
        codigo.comentar(`${c1.extra} + ${c2.extra}`);
        codigo.extra = `${c1.extra} + ${c2.extra}`;
        return codigo;
    }
}

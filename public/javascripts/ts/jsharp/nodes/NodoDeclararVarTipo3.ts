import {NodoAst, NodoAstPro} from "./NodoAst";
import {ZAmbito} from "../types/ZAmbito";
import {Codigo} from "./Codigo";
import {FileLocation} from "./FileLocation";
import {NodoDeclararVar} from "./NodoDeclararVar";
import {desenvolver, guardarTablaSimbolos} from "../Utilidades";
import {NTipoVar} from "../types/NTipo";
import {codigoAsignar, codigoObtenerVar} from "../types/codigos";


export class NodoDeclararVarTipo3 extends NodoAstPro {
    readonly id: string;
    readonly expression: NodoAst;

    constructor(fileLocation: FileLocation, id: string, expression: NodoAst) {
        super(fileLocation);
        this.id = id;
        this.expression = expression;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const codigoExp = desenvolver(this.expression.generarCodigo(ambito));

        const niuTipo = new NTipoVar(codigoExp.tipo);
        niuTipo.isConst = true;
        ambito.declararPropiedad(this.id, niuTipo);

        //
        guardarTablaSimbolos(this.id, codigoExp.tipo.nombre, this.getY(), this.getX(), this.getPath(), '');
        //


        const codigoVar = codigoObtenerVar(ambito, this.id);


        const codigoAsignado = codigoAsignar(codigoVar, codigoExp, true);

        const codigo = new Codigo();
        codigo.agregarCodigo(codigoExp);
        codigo.agregarCodigo(codigoAsignado);
        return codigo;

    }

}
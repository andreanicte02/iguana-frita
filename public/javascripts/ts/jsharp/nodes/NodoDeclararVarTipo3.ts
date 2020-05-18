import {NodoAst, NodoAstPro} from "./NodoAst";
import {ZAmbito} from "../types/ZAmbito";
import {Codigo} from "./Codigo";
import {FileLocation} from "./FileLocation";
import {NodoDeclararVar} from "./NodoDeclararVar";
import {desenvolver, generarTemporal, guardarTablaSimbolos} from "../Utilidades";
import {NTipoVar} from "../types/NTipo";
import {codigoAsignar, codigoObtenerVar} from "../types/codigos";
import {nTipoBooleanConEtiqueta} from "../types/TiposPrimitivos";
import {deBooleanoEtiquetaANormal} from "./TypeDefinition";


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


        const codigoExpAux = codigoExp.tipo === nTipoBooleanConEtiqueta ?
            deBooleanoEtiquetaANormal(codigoExp): codigoExp;

        guardarTablaSimbolos(this.id, codigoExpAux.tipo.nombre, this.getY(), this.getX(), this.getPath(), '');
        //
        const codigo = new Codigo();
        const esGlobal = ambito.padre === undefined;


        if (esGlobal) {
            const accesoDirecto = generarTemporal();
            const niuTipo = new NTipoVar(codigoExpAux.tipo, accesoDirecto);
            niuTipo.isConst = true;
            ambito.declararPropiedad(this.id, niuTipo);
            codigo.apuntador = accesoDirecto;
            codigo.agregar(`${codigo.apuntador} = H;`);
            codigo.comentar("captura de direccion");
            codigo.agregar(`H = H + 1;`);
            codigo.comentar(`variable ${this.id}`);
        }
        else {
            const niuTipo = new NTipoVar(codigoExpAux.tipo);
            niuTipo.isConst = true;
            ambito.declararPropiedad(this.id, niuTipo);
        }

        const codigoVar = codigoObtenerVar(ambito, this.id);
        const codigoAsignado = codigoAsignar(codigoVar, codigoExpAux, true);
        codigo.agregarCodigo(codigoExpAux);
        codigo.agregarCodigo(codigoAsignado);
        return codigo;

    }

}
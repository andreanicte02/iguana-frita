import {NodoAst, NodoAstPro} from "./NodoAst";
import {ZAmbito} from "../types/ZAmbito";
import {Codigo} from "./Codigo";
import {FileLocation} from "./FileLocation";
import {desenvolver, guardarTablaSimbolos} from "../Utilidades";
import {NTipo, NTipoVar} from "../types/NTipo";
import {buscarEnCadenaAmbito, codigoAsignar, codigoObtenerVar} from "../types/codigos";


export class NodoDeclararVarTipo4 extends NodoAstPro {
    readonly id: string;
    readonly expression: NodoAst;

    constructor(fileLocation: FileLocation, id: string, expression: NodoAst) {
        super(fileLocation);
        this.id = id;
        this.expression = expression;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const codigoExp = desenvolver(this.expression.generarCodigo(ambito));

        const global = buscarEnCadenaAmbito<ZAmbito>(ambito, a => {
            if(a.padre ===  undefined){
                return a;
            }
        });

        //debugger;

        if(global === undefined) {
            throw new Error('no se proporciono el ambito global :(');
        }
        global.declararPropiedad(this.id, new NTipoVar(codigoExp.tipo));


        //
        guardarTablaSimbolos(this.id, codigoExp.tipo.nombre, this.getY(), this.getX(), this.getPath(), '');
        //


        const codigoVar = codigoObtenerVar(global, this.id);
        const codigoAsignado = codigoAsignar(codigoVar, codigoExp, true);

        const codigo = new Codigo();
        codigo.agregarCodigo(codigoExp);
        codigo.agregarCodigo(codigoAsignado);
        return codigo;

    }

}
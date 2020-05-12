import {NodoAst, NodoAstPro} from "../NodoAst";
import {ZAmbito} from "../../types/ZAmbito";
import {Codigo} from "../Codigo";
import {FileLocation} from "../FileLocation";
import {desenvolver} from "../../Utilidades";
import {buscarEnCadenaAmbito, codigoAsignar, codigoObtenerVar} from "../../types/codigos";
import {NTipoVar} from "../../types/NTipo";
import {SemanticError} from "../../types/SemanticError";
import {NFuncion} from "../../types/NFuncion.js";


export class NodoReturn  extends  NodoAstPro{

    private readonly expression: NodoAst | undefined;

    constructor(fileLocation: FileLocation, expression: NodoAst) {
        super(fileLocation);
        this.expression = expression;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        //verificar si existe
        const tupla = buscarEnCadenaAmbito<{indice: number; nTipoVar: NTipoVar}>(
            ambito,
            a =>  a.buscarPropiedadConDireccionRelativa(NFuncion.RETURN)

        );

        const etiquetaFinFuncion = buscarEnCadenaAmbito<string>(ambito, a=> a.etiquetaFinFuncion);

        if(etiquetaFinFuncion === undefined){
            throw new Error('no se suministro la etiqueta de salida');
        }

        const codigo = new Codigo();

        //void
        if(tupla === undefined && this.expression === undefined){

            codigo.agregar(`goto ${etiquetaFinFuncion};`);
            codigo.comentar('return');
            return codigo;

        }


        //si existe la variable return se espera una expression
        if( tupla !== undefined && this.expression !== undefined){

            const codigoDestino = codigoObtenerVar(ambito,NFuncion.RETURN);
            const codigoValor = desenvolver(this.expression.generarCodigo(ambito));

            codigo.agregarCodigo(codigoAsignar(codigoDestino, codigoValor));

            codigo.agregar(`goto ${etiquetaFinFuncion};`);
            codigo.comentar('return');
            return codigo;
        }


        throw new SemanticError('Se agrego un "return exp ;" a una funcion de tipo void | se agrego un "return ;" vacio a una funcion con tipo');

    }

}
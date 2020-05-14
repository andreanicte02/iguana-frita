import {NodoAst, NodoAstPro} from "../NodoAst";
import {ZAmbito} from "../../types/ZAmbito";
import {Codigo} from "../Codigo";
import {FileLocation} from "../FileLocation";
import {desenvolver, generarTemporal} from "../../Utilidades";
import {esNumero} from "../TypeDefinition";
import {SemanticError} from "../../types/SemanticError";
import {NTipoVar} from "../../types/NTipo";

export class NodoAumento extends NodoAstPro{

    public readonly expression: NodoAst;
    public readonly symbol: string;

    constructor(fileLocation: FileLocation, expression: NodoAst, symbol: string) {
        super(fileLocation);
        this.expression = expression;
        this.symbol = symbol;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {



        const codigoExpression = this.expression.generarCodigo(ambito);


        if(!(codigoExpression.tipo instanceof NTipoVar)){
            throw new SemanticError('el operador incrmento solo se puede aplicar en variables');
        }

        const codigoExpFinal = desenvolver(codigoExpression);

        if(!esNumero(codigoExpFinal)){

            throw new SemanticError('operador incrmento solo se puede aplicar en numericos');
        }

        //debugger;

        const codigo = new Codigo();
        codigo.agregarCodigo(codigoExpFinal);
        codigo.tipo = codigoExpFinal.tipo;
        codigo.apuntador = codigoExpFinal.apuntador;

        const temporal = generarTemporal();
        codigo.agregar(`${temporal} = ${codigoExpFinal.apuntador} ${this.symbol} 1;`);

        codigo.agregar(`${codigoExpression.acceso} = ${temporal};`);

        //debugger;
        return codigo;

    }


}
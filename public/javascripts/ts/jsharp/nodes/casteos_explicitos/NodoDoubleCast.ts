import {NodoAst, NodoAstPro} from "../NodoAst";
import {FileLocation} from "../FileLocation";
import {Codigo} from "../Codigo";
import {ZAmbito} from "../../types/ZAmbito";
import {desenvolver, generarTemporal} from "../../Utilidades";
import {esNumero} from "../TypeDefinition";
import {SemanticError} from "../../types/SemanticError";
import {nTipoChar, nTipoDouble, nTipoEntero} from "../../types/TiposPrimitivos";

export class NodoDoubleCast extends NodoAstPro{
    public readonly e1: NodoAst;

    constructor(fileLocation: FileLocation, e1: NodoAst) {
        super(fileLocation);
        this.e1 = e1;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const codigoExpresion = desenvolver(this.e1.generarCodigo(ambito));

        if(!esNumero(codigoExpresion)){
            throw new SemanticError('no se puede aplicar un casteo explicto double a un tipo no numerico')
        }

        const codigo = new Codigo();
        codigo.tipo = nTipoDouble;
        codigo.apuntador = codigoExpresion.apuntador;
        codigo.agregarCodigo(codigoExpresion);
        codigo.extra= `(${codigoExpresion.extra}) double`;
        return codigo;
    }

}
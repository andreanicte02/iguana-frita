import {NodoAst, NodoAstPro} from "./NodoAst";
import {FileLocation} from "./FileLocation";
import {ZAmbito} from "../types/ZAmbito";
import {Codigo} from "./Codigo";
import {desenvolver} from "../Utilidades";
import {deBolleanoNormalAEtiqueta, esBoleano} from "./TypeDefinition";
import {SemanticError} from "../types/SemanticError";
import {nTipoBooleanConEtiqueta, nTipoBooleanNormal} from "../types/TiposPrimitivos";


export class NodoNot  extends NodoAstPro{
    public readonly e1: NodoAst;
    private readonly symbol: string;

    constructor(fileLocation: FileLocation, e1: NodoAst) {
        super(fileLocation);
        this.e1 = e1;
        this.symbol = '!';

    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const c1 = desenvolver(this.e1.generarCodigo(ambito));


        if(!esBoleano(c1)){
            throw new SemanticError(`Error de tipos operacion  ${this.symbol} ${c1.tipo.nombre}`);
        }

        const codigo = new Codigo();

        const aux = codigo.tipo === nTipoBooleanConEtiqueta? c1 : deBolleanoNormalAEtiqueta(c1);


        codigo.eFalse = aux.eTrue;
        codigo.eTrue = aux.eFalse;

        codigo.agregarCodigo(aux);

        return codigo;

    }





}



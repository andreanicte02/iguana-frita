import {NodoAst, NodoAstPro} from "./NodoAst";
import {FileLocation} from "./FileLocation";
import {ZAmbito} from "../types/ZAmbito";
import {Codigo} from "./Codigo";
import {desenvolver} from "../Utilidades";
import {deBolleanoNormalAEtiqueta, esBoleano} from "./TypeDefinition";
import {SemanticError} from "../types/SemanticError";
import {nTipoBooleanConEtiqueta} from "../types/TiposPrimitivos";


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



        const aux1 = c1.tipo === nTipoBooleanConEtiqueta ? c1 : deBolleanoNormalAEtiqueta(c1);

        const codigo = new Codigo();

        codigo.tipo = aux1.tipo;
        codigo.pasarEtiquetasFalsas(aux1.eTrue);
        codigo.pasarEtiquetasVerdaderas(aux1.eFalse);
        codigo.agregarCodigo(aux1);

        codigo.comentar(`! ${aux1.extra}`)
        codigo.comentar(`etiquetas true: ${codigo.eTrue.join(',')}`)
        codigo.comentar(`etiquetas false: ${codigo.eFalse.join(',')}`)

        codigo.extra= `! ${aux1.extra}`;

        return codigo;

    }





}



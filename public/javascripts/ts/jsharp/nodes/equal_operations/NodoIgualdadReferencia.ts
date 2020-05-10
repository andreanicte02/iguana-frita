import {NodoAst, NodoAstPro} from "../NodoAst";
import {ZAmbito} from "../../types/ZAmbito";
import {Codigo} from "../Codigo";
import {FileLocation} from "../FileLocation";
import {desenvolver, generarEtiqueta} from "../../Utilidades";
import {esPrimitivo} from "../TypeDefinition";
import {SemanticError} from "../../types/SemanticError";
import {nTipoBooleanConEtiqueta} from "../../types/TiposPrimitivos";

export class NodoIgualdadReferencia extends NodoAstPro{

    public readonly e1: NodoAst;
    public readonly e2: NodoAst;
    private readonly symbol: string;


    constructor(fileLocation: FileLocation,e1: NodoAst, e2: NodoAst) {
        super(fileLocation);
        this.e1 = e1;
        this.e2 = e2;
        this.symbol = '==='
    }
    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const c1 = desenvolver(this.e1.generarCodigo(ambito));
        const c2 = desenvolver(this.e2.generarCodigo(ambito));

        if(esPrimitivo(c1)){
            throw new SemanticError(`No se permiten tipos primitivos  ${c1.tipo.nombre} === ${c2.tipo.nombre}`)
        }

        if(esPrimitivo(c2)){
            throw new SemanticError(`No se permiten tipos primitivos  ${c1.tipo.nombre} === ${c2.tipo.nombre}`)
        }

        const etiquetaVerdadera = generarEtiqueta();
        const etiquetaFalsa = generarEtiqueta();

        const codigo = new Codigo();
        codigo.guardarEtiquetaVerdadera(etiquetaVerdadera);
        codigo.guardarEtiquetaFalsa(etiquetaFalsa);

        codigo.agregarCodigo(c1);
        codigo.agregarCodigo(c2);
        codigo.tipo = nTipoBooleanConEtiqueta;

        codigo.agregar(`if ${c1.apuntador} == ${c2.apuntador} goto ${etiquetaVerdadera};`);
        codigo.comentar(`if ${c1.apuntador} ${this.symbol} ${c2.apuntador} - etiquetas true: ${codigo.eTrue.join(',')}`)


        codigo.agregar(`goto ${etiquetaFalsa};`)
        codigo.comentar(`if ${c1.apuntador} ${this.symbol} ${c2.apuntador} - etiquetas false: ${codigo.eFalse.join(',')}`)


        codigo.extra+=`if ${c1.apuntador} ${this.symbol} ${c2.apuntador}`;

        return codigo;


    }

}
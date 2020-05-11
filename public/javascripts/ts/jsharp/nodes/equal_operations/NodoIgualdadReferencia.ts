import {NodoAst, NodoAstPro} from "../NodoAst";
import {ZAmbito} from "../../types/ZAmbito";
import {Codigo} from "../Codigo";
import {FileLocation} from "../FileLocation";
import {desenvolver, generarEtiqueta} from "../../Utilidades";
import {deBooleanoEtiquetaANormal, esPrimitivo, obtenerTipoIgualdadxReferencia} from "../TypeDefinition";
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

        const tipo = obtenerTipoIgualdadxReferencia(c1, c2);

        if(tipo === undefined){

            throw new SemanticError(`Error de tipos operacion ${c1.tipo.nombre} ${this.symbol} ${c2.tipo.nombre} `);

        }

        const aux1 = c1.tipo === nTipoBooleanConEtiqueta ?deBooleanoEtiquetaANormal(c1): c1;
        const aux2 = c2.tipo === nTipoBooleanConEtiqueta ?deBooleanoEtiquetaANormal(c2): c2;


        const etiquetaVerdadera = generarEtiqueta();
        const etiquetaFalsa = generarEtiqueta();

        const codigo = new Codigo();
        codigo.guardarEtiquetaVerdadera(etiquetaVerdadera);
        codigo.guardarEtiquetaFalsa(etiquetaFalsa);

        codigo.agregarCodigo(aux1);
        codigo.agregarCodigo(aux2);
        codigo.tipo = nTipoBooleanConEtiqueta;

        codigo.agregar(`if (${aux1.apuntador} == ${aux2.apuntador}) goto ${etiquetaVerdadera};`);
        codigo.comentar(`if ${aux1.apuntador} ${this.symbol} ${aux2.apuntador} - etiquetas true: ${codigo.eTrue.join(',')}`)


        codigo.agregar(`goto ${etiquetaFalsa};`)
        codigo.comentar(`if ${aux1.apuntador} ${this.symbol} ${aux2.apuntador} - etiquetas false: ${codigo.eFalse.join(',')}`)


        codigo.extra+=`if ${aux1.apuntador} ${this.symbol} ${aux2.apuntador}`;

        return codigo;


    }

}
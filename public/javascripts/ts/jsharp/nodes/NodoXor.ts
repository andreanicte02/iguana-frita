import {NodoAst, NodoAstPro} from "./NodoAst";
import {FileLocation} from "./FileLocation";
import { ZAmbito } from "../types/ZAmbito";
import { Codigo } from "./Codigo";
import {desenvolver, generarEtiqueta} from "../Utilidades";
import {deBooleanoEtiquetaANormal, esBoleano} from "./TypeDefinition";
import {SemanticError} from "../types/SemanticError";
import {nTipoBooleanConEtiqueta} from "../types/TiposPrimitivos";

export class NodoXor extends NodoAstPro{

    public readonly e1: NodoAst;
    public readonly e2: NodoAst;
    private readonly symbol: string;

    constructor(fileLocation: FileLocation, e1: NodoAst, e2: NodoAst) {
        super(fileLocation);
        this.e1 = e1;
        this.e2 = e2;
        this.symbol = '^';
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {



        const c1 = desenvolver(this.e1.generarCodigo(ambito));
        const c2 = desenvolver(this.e2.generarCodigo(ambito));


        if(!esBoleano(c1) && !esBoleano(c2)){
            throw new SemanticError(`Error de tipos operacion ${c1.tipo.nombre} ${this.symbol} ${c2.tipo.nombre} `);
        }

        const aux1 = c1.tipo === nTipoBooleanConEtiqueta ?deBooleanoEtiquetaANormal(c1): c1;
        const aux2 = c2.tipo === nTipoBooleanConEtiqueta ?deBooleanoEtiquetaANormal(c2): c2;

        const codigo = new Codigo();
        codigo.tipo = nTipoBooleanConEtiqueta;

        codigo.agregarCodigo(aux1);
        codigo.agregarCodigo(aux2);
        const eVerdadera = generarEtiqueta();
        const eFalsa = generarEtiqueta();

        codigo.guardarEtiquetaVerdadera(eVerdadera);
        codigo.guardarEtiquetaFalsa(eFalsa);


        codigo.agregar(`if (${aux1.apuntador} != ${aux2.apuntador}) goto ${eVerdadera};`);
        codigo.agregar(`goto ${eFalsa};`);

        codigo.extra = `if ${aux1.extra} ^ ${aux2.extra}`;

        return codigo;

    }

}
import {NodoAst, NodoAstPro} from "./NodoAst";
import {FileLocation} from "./FileLocation";
import {ZAmbito} from "../types/ZAmbito";
import {Codigo} from "./Codigo";
import {desenvolver} from "../Utilidades";
import {deBolleanoNormalAEtiqueta, esBoleano} from "./TypeDefinition";
import {SemanticError} from "../types/SemanticError";
import {nTipoBooleanConEtiqueta, nTipoBooleanNormal} from "../types/TiposPrimitivos";

export class NodoOr extends NodoAstPro{
    public readonly e1: NodoAst;
    public readonly e2: NodoAst;
    private readonly symbol: string;

    constructor(fileLocation: FileLocation, e1: NodoAst, e2: NodoAst) {
        super(fileLocation);
        this.e1 = e1;
        this.e2 = e2;
        this.symbol = '||';
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const c1 = desenvolver(this.e1.generarCodigo(ambito));
        const c2 = desenvolver(this.e2.generarCodigo(ambito));

        //const tipo = obtenerTipoOperacionLogica(c1,c2);

        if(!esBoleano(c1) && !esBoleano(c2)){
            throw new SemanticError(`Error de tipos operacion ${c1.tipo.nombre} ${this.symbol} ${c2.tipo.nombre} `);
        }

        const aux1 = c1.tipo === nTipoBooleanConEtiqueta ? c1 : deBolleanoNormalAEtiqueta(c1);
        const aux2 = c2.tipo === nTipoBooleanConEtiqueta ? c2 : deBolleanoNormalAEtiqueta(c2);



        const  codigo = new Codigo();
        codigo.tipo = nTipoBooleanConEtiqueta;


        codigo.pasarEtiquetasVerdaderas(aux1.eTrue);
        codigo.pasarEtiquetasVerdaderas(aux2.eTrue);

        codigo.pasarEtiquetasFalsas(aux2.eFalse);

        codigo.agregarCodigo(aux1);
        codigo.agregar(`${aux1.eFalse.reduce((a,x)=> a += "," + x )} :`);
        codigo.agregarCodigo(aux2);


        codigo.extra = `${aux1.extra} || ${aux2.extra}`
        codigo.comentar(`${aux1.extra} || ${aux2.extra}`);
        return codigo;
    }

}
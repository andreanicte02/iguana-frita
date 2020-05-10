import {NodoAst, NodoAstPro} from "../NodoAst";
import {ZAmbito} from "../../types/ZAmbito";
import {Codigo} from "../Codigo";
import {FileLocation} from "../FileLocation";
import {codigoGenerarBloque, desenvolver, generarEtiqueta} from "../../Utilidades";
import {deBooleanoEtiquetaANormal, esBoleano} from "../TypeDefinition";
import {SemanticError} from "../../types/SemanticError";
import {nTipoBooleanConEtiqueta} from "../../types/TiposPrimitivos";

export class NodoWhile extends NodoAstPro{

    private readonly condicion: NodoAst;
    private readonly sentencias: NodoAst[];

    constructor(fileLocation: FileLocation, condicion: NodoAst, sentencias: NodoAst[]) {
        super(fileLocation);
        this.condicion = condicion;
        this.sentencias = sentencias;
    }
    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const codigoCondicion = desenvolver(this.condicion.generarCodigo(ambito));

        if(!esBoleano(codigoCondicion)){

            throw new SemanticError('la condicion no es de tipo bool');
        }

        const codigoCondicionAuxiliar = codigoCondicion.tipo === nTipoBooleanConEtiqueta?
            deBooleanoEtiquetaANormal(codigoCondicion): codigoCondicion;

        const codigo = new Codigo();
        const ambitoWhile = new ZAmbito(ambito);

        const etiquetaInicio = generarEtiqueta();
        const etiquetaSalida = generarEtiqueta();
        ambitoWhile.labelFin = etiquetaSalida;
        ambitoWhile.labelInicio = etiquetaInicio;

        codigo.agregar(`${etiquetaInicio} :`)

        codigo.agregarCodigo(codigoCondicionAuxiliar);

        codigo.comentar(`LInicio while`);
        codigo.agregar(`if (${codigoCondicionAuxiliar.apuntador} == 0) goto ${etiquetaSalida};`);
        codigo.comentar(`LInicio while`);

        codigo.agregarCodigo(codigoGenerarBloque(this.sentencias, ambitoWhile));

        codigo.agregar(`goto ${etiquetaInicio};`);

        codigo.agregar(`${etiquetaSalida} :`);
        codigo.comentar('fin while');


        return  codigo;


    }

}
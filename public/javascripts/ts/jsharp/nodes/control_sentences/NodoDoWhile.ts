import {NodoAst, NodoAstPro} from "../NodoAst";
import {Codigo} from "../Codigo";
import {ZAmbito} from "../../types/ZAmbito";
import {FileLocation} from "../FileLocation";
import {codigoGenerarBloque, desenvolver, generarEtiqueta} from "../../Utilidades";
import {deBooleanoEtiquetaANormal, esBoleano} from "../TypeDefinition";
import {SemanticError} from "../../types/SemanticError";
import {nTipoBooleanConEtiqueta} from "../../types/TiposPrimitivos";

export class NodoDoWhile extends NodoAstPro{
    private readonly condicion: NodoAst;
    private readonly sentencias: NodoAst[];

    constructor(fileLocation: FileLocation, condicion: NodoAst, sentencias: NodoAst[]) {
        super(fileLocation);
        this.condicion = condicion;
        this.sentencias = sentencias;
    }


    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {


        const codigo = new Codigo();
        const ambitoDoWhile = new ZAmbito(ambito);

        const etiquetaInicio = generarEtiqueta();
        const etiquetaSalida = generarEtiqueta();

        ambitoDoWhile.labelFin = etiquetaSalida;

        codigo.agregar(`${etiquetaInicio} :`)
        codigo.comentar('inicio doWhile');

        codigo.agregarCodigo(codigoGenerarBloque(this.sentencias, ambitoDoWhile));


        //----condicion
        const codigoCondicion = desenvolver(this.condicion.generarCodigo(ambito));

        if(!esBoleano(codigoCondicion)){

            throw new SemanticError('la condicion no es de tipo bool');
        }

        const codigoCondicionAuxiliar = codigoCondicion.tipo === nTipoBooleanConEtiqueta?
            deBooleanoEtiquetaANormal(codigoCondicion): codigoCondicion;
        //--fin condicion

        codigo.agregarCodigo(codigoCondicionAuxiliar);


        codigo.agregar(`if ${codigoCondicionAuxiliar.apuntador} == 1 goto ${etiquetaInicio};`);
        codigo.comentar(`doWhile ${codigoCondicionAuxiliar.extra}`);

        codigo.agregar(`goto ${etiquetaSalida} ;`)

        codigo.agregar(`${etiquetaSalida} :`)
        codigo.comentar('fin do while');
        //todo: agregar una etiqueta de fin, para el break

        return codigo;

    }

}
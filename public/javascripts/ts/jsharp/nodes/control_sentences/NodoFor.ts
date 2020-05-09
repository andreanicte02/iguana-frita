import {NodoAst, NodoAstPro} from "../NodoAst";
import {ZAmbito} from "../../types/ZAmbito";
import {Codigo} from "../Codigo";
import {FileLocation} from "../FileLocation";
import {codigoGenerarBloque, desenvolver, generarEtiqueta} from "../../Utilidades";
import {nTipoBooleanConEtiqueta} from "../../types/TiposPrimitivos";
import {deBooleanoEtiquetaANormal} from "../TypeDefinition";

export class NodoFor extends NodoAstPro{

    private readonly forInit: NodoAst;
    private readonly forCondition: NodoAst;
    private readonly forIncrease: NodoAst;
    private readonly sentences: NodoAst[];

    constructor(fileLocation: FileLocation,forInit: NodoAst, forCondition: NodoAst, forIncrase: NodoAst ,
                sentence: NodoAst[]) {
        super(fileLocation);
        this.forCondition = forCondition;
        this.forIncrease = forIncrase;
        this.forInit = forInit;
        this.sentences = sentence;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const ambitoFor = new ZAmbito(ambito);

        const codigoForInit = this.forInit.generarCodigo(ambitoFor);

        const codigo = new Codigo();
        const etiquetaInicio = generarEtiqueta();
        const etiquetaSalida = generarEtiqueta();

        ambitoFor.labelFin = etiquetaSalida;
        ambitoFor.labelInicio = etiquetaInicio;

        codigo.comentar('inicio for')
        codigo.agregarCodigo(codigoForInit);

        codigo.agregar(`${etiquetaInicio} :`);


        const codigoCondicion = desenvolver(this.forCondition.generarCodigo(ambitoFor));
        const codigoCondicionAuxiliar = codigoCondicion.tipo === nTipoBooleanConEtiqueta
            ? deBooleanoEtiquetaANormal(codigoCondicion): codigoCondicion;

        codigo.agregarCodigo(codigoCondicionAuxiliar);

        codigo.agregar(`if ${codigoCondicionAuxiliar.apuntador} == 0 goto ${etiquetaSalida} ;`);

        codigo.agregarCodigo(codigoGenerarBloque(this.sentences, ambitoFor));

        const codigoIncremento = desenvolver(this.forIncrease.generarCodigo(ambitoFor));

        codigo.agregarCodigo(codigoIncremento);

        codigo.agregar(`${etiquetaSalida} :`)

        codigo.comentar('fin for');

        return codigo;

    }
    
}
import {NodoAst, NodoAstPro} from "../NodoAst";
import {ZAmbito} from "../../types/ZAmbito";
import {Codigo} from "../Codigo";
import {FileLocation} from "../FileLocation";
import {codigoGenerarBloque, desenvolver, generarEtiqueta} from "../../Utilidades";
import {nTipoBooleanConEtiqueta} from "../../types/TiposPrimitivos";
import {deBooleanoEtiquetaANormal} from "../TypeDefinition";
import {NodoCase} from "./NodoCase";

export class NodoSwitch extends NodoAstPro{
    private readonly expression: NodoAstPro;
    private readonly cases: NodoCase[];
    private readonly defaultSentences: NodoAst[]

    constructor(fileLocation: FileLocation, expression: NodoAstPro, cases: NodoCase[], defaultSent: NodoAst[]) {
        super(fileLocation);
        this.expression = expression;
        this.cases = cases;
        this.defaultSentences = defaultSent;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const codigo = new Codigo();
        const codigoCondiciones = new Codigo();
        const codigoBloques = new Codigo();
        const etiquetaDefault = generarEtiqueta();
        const etiquetaSalida = generarEtiqueta();

        const ambitSwtich = new ZAmbito(ambito);
        ambitSwtich.labelFin = etiquetaSalida;

        this.cases.forEach(value => {
            codigoCondiciones.agregarCodigo(value.generarCodigoCondicion(this.expression,ambitSwtich))
            codigoBloques.agregarCodigo(value.generarCodigo(ambitSwtich));
        })

        codigo.agregarCodigo(codigoCondiciones);
        codigo.agregar(`goto ${etiquetaDefault};`);

        codigo.agregarCodigo(codigoBloques);
        codigo.agregar(`${etiquetaDefault} :`)

        codigo.agregarCodigo(codigoGenerarBloque(this.defaultSentences,ambitSwtich));

        codigo.agregar(`${etiquetaSalida} :`)

        return codigo;

    }

}
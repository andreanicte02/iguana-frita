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

        const codigoExp = desenvolver(this.expression.generarCodigo(ambito));

        const codigoExpAux = codigoExp.tipo=== nTipoBooleanConEtiqueta ?
            deBooleanoEtiquetaANormal(codigoExp): codigoExp;

        codigo.agregarCodigo(codigoExpAux);
        codigo.comentar('inicio switch');
        const etiquetaSalida = generarEtiqueta();
        const ambitoSwitch = new ZAmbito(ambito);
        ambitoSwitch.labelFin = etiquetaSalida;

        this.cases.forEach(value => {
                value.setApuntadorOriginal(codigoExpAux.apuntador);
                codigo.agregarCodigo(value.generarCodigo(ambitoSwitch));
            }
        )

        const etiquetaDef = generarEtiqueta();

        codigo.agregar(`${etiquetaDef} :`)
        codigo.comentar('default:')
        codigo.agregarCodigo(codigoGenerarBloque(this.defaultSentences,ambitoSwitch));

        codigo.agregar(`${etiquetaSalida} :`)
        codigo.comentar('fin switch')


        return codigo;
    }

}
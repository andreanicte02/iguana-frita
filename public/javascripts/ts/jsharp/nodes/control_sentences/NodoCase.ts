import {NodoAst, NodoAstPro} from "../NodoAst";
import {ZAmbito} from "../../types/ZAmbito";
import {Codigo} from "../Codigo";
import {FileLocation} from "../FileLocation";
import {codigoGenerarBloque, desenvolver, generarEtiqueta} from "../../Utilidades";
import {nTipoBooleanConEtiqueta} from "../../types/TiposPrimitivos";
import {deBooleanoEtiquetaANormal} from "../TypeDefinition";

export class NodoCase extends NodoAstPro{

    private readonly sentences: NodoAst[];
    private readonly expression: NodoAst;

    private apuntadorSwitch: string | undefined;





    constructor(fileLocation: FileLocation, expression: NodoAst, sentences: NodoAst[]) {
        super(fileLocation);
        this.expression = expression;
        this.sentences = sentences;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        if(this.apuntadorSwitch === undefined){
            throw new Error('No se sumisitro apuntador del switch')
        }

        const codigoExpression = desenvolver(this.expression.generarCodigo(ambito));

        const codigoExpAux = codigoExpression.tipo === nTipoBooleanConEtiqueta ?
            deBooleanoEtiquetaANormal(codigoExpression): codigoExpression;

        const codigo = new Codigo();
        codigo.agregarCodigo(codigoExpAux);
        codigo.comentar('inicio case')
        const etiquetaV = generarEtiqueta();
        const etiquetaF = generarEtiqueta();

        codigo.agregar(`if (${codigoExpAux.apuntador} == ${this.apuntadorSwitch}) goto ${etiquetaV};`)
        codigo.agregar(`goto ${etiquetaF};`)

        codigo.agregar(`${etiquetaV} :`)
        codigo.agregarCodigo(codigoGenerarBloque(this.sentences, ambito));

        codigo.agregar(`${etiquetaF} :`)
        codigo.comentar('fin case');

        return codigo;
    }

    public setApuntadorOriginal(apuntador: string){
        this.apuntadorSwitch = apuntador;
    }





}
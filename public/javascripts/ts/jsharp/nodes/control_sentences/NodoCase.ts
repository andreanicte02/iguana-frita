import {NodoAst, NodoAstPro} from "../NodoAst";
import {ZAmbito} from "../../types/ZAmbito";
import {Codigo} from "../Codigo";
import {FileLocation} from "../FileLocation";
import {codigoGenerarBloque, desenvolver, generarEtiqueta} from "../../Utilidades";
import {nTipoBooleanConEtiqueta} from "../../types/TiposPrimitivos";
import {
    codigoIgualacionXValor,
    deBooleanoEtiquetaANormal,
    obtenerTipoIgualdadValor
} from "../TypeDefinition";
import {SemanticError} from "../../types/SemanticError";

export class NodoCase extends NodoAstPro{

    private readonly sentences: NodoAst[];
    private readonly expression: NodoAst;


    private etiquetaV: string | undefined;





    constructor(fileLocation: FileLocation, expression: NodoAst, sentences: NodoAst[]) {
        super(fileLocation);
        this.expression = expression;
        this.sentences = sentences;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        if(this.etiquetaV === undefined){
            throw new Error('no se ha proporcionado una etiqueta verdadera');
        }

        const codigo = new Codigo();

        codigo.agregar(`${this.etiquetaV} :`)
        codigo.agregarCodigo(codigoGenerarBloque(this.sentences,ambito));



        return codigo;
    }

    public generarCodigoCondicion(nodoSwitch: NodoAst ,ambito: ZAmbito): Codigo{

        const c1 = desenvolver(nodoSwitch.generarCodigo(ambito));
        const c2 = desenvolver(this.expression.generarCodigo(ambito));
        const symbol = '==';

        //TODO falta el manejo de strings
        const tipo = obtenerTipoIgualdadValor(c1,c2, ambito);

        if(tipo === undefined){

            throw new SemanticError(`No se permiten tipos no primitivos  ${c1.tipo.nombre} switch ${c2.tipo.nombre}`)

        }

        const aux1 = c1.tipo === nTipoBooleanConEtiqueta ?deBooleanoEtiquetaANormal(c1): c1;
        const aux2 = c2.tipo === nTipoBooleanConEtiqueta ?deBooleanoEtiquetaANormal(c2): c2;


        const etiquetaVerdadera = generarEtiqueta();
        this.etiquetaV = etiquetaVerdadera;


        const codigo = new Codigo();
        codigo.guardarEtiquetaVerdadera(etiquetaVerdadera);

        codigo.agregarCodigo(aux1);
        codigo.agregarCodigo(aux2);
        codigo.tipo = nTipoBooleanConEtiqueta;

        codigo.agregar(`if (${aux1.apuntador} ${symbol} ${aux2.apuntador}) goto ${etiquetaVerdadera};`);

        return codigo;


    }






}
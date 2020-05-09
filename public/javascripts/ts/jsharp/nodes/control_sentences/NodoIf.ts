import {NodoAstPro} from "../NodoAst";
import {ZAmbito} from "../../types/ZAmbito";
import {Codigo} from "../Codigo";
import {FileLocation} from "../FileLocation";
import {codigoGenerarBloque, desenvolver, generarEtiqueta} from "../../Utilidades";
import {deBooleanoEtiquetaANormal, esBoleano} from "../TypeDefinition";
import {SemanticError} from "../../types/SemanticError";
import {nTipoBooleanConEtiqueta} from "../../types/TiposPrimitivos";

export class NodoIf extends NodoAstPro{

    private readonly condicion: NodoAstPro;
    private readonly nodosVerdaderos: NodoAstPro [];
    private readonly nodosFalsos: NodoAstPro [];

    constructor(fileLocation: FileLocation, condicion: NodoAstPro, nodosTrue: NodoAstPro [], nodosFalse: NodoAstPro []) {
        super(fileLocation);
        this.condicion = condicion;
        this.nodosVerdaderos = nodosTrue;
        this.nodosFalsos = nodosFalse;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const  codigoCondicion = desenvolver(this.condicion.generarCodigo(ambito));

        if(!esBoleano(codigoCondicion)){
            throw new SemanticError('la condicion no es de tipo bool');
        }

        const ambitoVerdadero = new ZAmbito(ambito);
        const ambitoFalso = new ZAmbito(ambito)

        const codigoCondicionAux = codigoCondicion.tipo === nTipoBooleanConEtiqueta?
            deBooleanoEtiquetaANormal(codigoCondicion): codigoCondicion;

        const codigo = new Codigo();
        const etiquetaF = generarEtiqueta();
        const etiquetaSalida = generarEtiqueta();

        codigo.agregarCodigo(codigoCondicionAux);


        codigo.agregar(`if (${codigoCondicionAux.apuntador} == 0) goto ${etiquetaF};` );
        codigo.comentar('if  init');

        codigo.agregarCodigo(codigoGenerarBloque(this.nodosVerdaderos,ambitoVerdadero));


        codigo.agregar(`goto ${etiquetaSalida};`)

        codigo.comentar('endif')


        codigo.agregar(`${etiquetaF} :`)
        codigo.comentar('else')
        codigo.agregarCodigo(codigoGenerarBloque(this.nodosFalsos, ambitoFalso));

        codigo.comentar('endelse')

        codigo.agregar(`${etiquetaSalida} :`)


        return codigo;

    }

}
import {NodoAst, NodoAstPro} from "./NodoAst";
import {ZAmbito} from "../types/ZAmbito";
import {Codigo} from "./Codigo";
import {NodoDeclararVar} from "./NodoDeclararVar";
import {FileLocation} from "./FileLocation";
import {desenvolver} from "../Utilidades.js";
import {codigoAsignar, codigoObtenerVar} from "../types/codigos.js";
import {nTipoBooleanConEtiqueta} from "../types/TiposPrimitivos";
import {deBooleanoEtiquetaANormal} from "./TypeDefinition";

export class NodoDeclararVarTipo1 extends NodoAstPro{

    readonly nodoObtenerTipo: NodoAst;
    readonly listId: NodoDeclararVar[];
    readonly isArray: boolean;
    private readonly nodoValor: NodoAst;

    constructor(
        fileLocation: FileLocation,
        nodoObtenerTipo: NodoAst,
        isArray: boolean,
        listId: NodoDeclararVar[],
        nodoValor: NodoAst,
    ) {
        super(fileLocation);
        this.nodoObtenerTipo = nodoObtenerTipo;
        this.isArray = isArray;
        this.listId=listId;
        this.nodoValor = nodoValor;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        /// se declaran todos las variables
        const tipo: NodoAst = this.nodoObtenerTipo;
        const nodosDeclaraciones = this.listId.map((value) => {
            value.definirTipo(tipo, this.isArray);
            return value.generarCodigo(ambito);
        })

        // se obtiene el valor
        const codigoValor = desenvolver(this.nodoValor.generarCodigo(ambito));

        // se asigna el mismo valor a todas las variables declaradas
        const codigo = new Codigo();
        codigo.agregarCodigos(nodosDeclaraciones);

        const codigoValorAux = codigoValor.tipo === nTipoBooleanConEtiqueta ?
            deBooleanoEtiquetaANormal(codigoValor): codigoValor;

        codigo.agregarCodigo(codigoValorAux);
        const codigosAsignacion = this.listId.map(nodoDeclarar => {
            // debugger;
            const codigoVar = codigoObtenerVar(ambito, nodoDeclarar.nombre);
            return codigoAsignar(codigoVar, codigoValorAux, true);
        });

        codigo.agregarCodigos(codigosAsignacion);
        return codigo;
    }

}
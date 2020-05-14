import {NodoAst, NodoAstPro} from "./NodoAst";
import {ZAmbito} from "../types/ZAmbito";
import {Codigo} from "./Codigo";
import {NodoDeclararVar} from "./NodoDeclararVar";
import {FileLocation} from "./FileLocation";
import {codigoAsignar, codigoObtenerVar} from "../types/codigos";
import {NodoCrearNull} from "./NodoCrearNull";

export class NodoDeclararVarTipo5 extends NodoAstPro{

    public nodoObtenerTipo: NodoAst;
    public listId: NodoDeclararVar[];
    public isArray: boolean;

    constructor(fileLocation: FileLocation,nodoObtenerTipo: NodoAst, isArray: boolean ,listId: NodoDeclararVar[]) {
        super(fileLocation);
        this.nodoObtenerTipo = nodoObtenerTipo;
        this.isArray = isArray;
        this.listId=listId;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const tipo: NodoAst = this.nodoObtenerTipo;

        this.listId.forEach((value) => {
            value.definirTipo(tipo, this.isArray);
            value.generarCodigo(ambito);
        })


        const codigo= new Codigo();
        const codigosAsignacion = this.listId.map(nodoDeclarar => {
            debugger;
            const codigoValorAux  = new Codigo();
            codigoValorAux.apuntador = '0';

            const codigoVar = codigoObtenerVar(ambito, nodoDeclarar.nombre);
            return codigoAsignar(codigoVar, codigoValorAux, true,true);
        });

        codigo.agregarCodigos(codigosAsignacion);
        return codigo;
    }
    
}
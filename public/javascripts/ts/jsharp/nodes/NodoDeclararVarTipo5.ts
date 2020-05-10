import {NodoAst, NodoAstPro} from "./NodoAst";
import {ZAmbito} from "../types/ZAmbito";
import {Codigo} from "./Codigo";
import {NodoDeclararVar} from "./NodoDeclararVar";
import {FileLocation} from "./FileLocation";

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
        
        return Codigo.vacio;
    }
    
}
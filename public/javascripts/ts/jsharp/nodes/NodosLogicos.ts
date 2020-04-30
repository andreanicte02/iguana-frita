import {NodoAst, NodoAstPro} from "./NodoAst";
import {ZAmbito} from "../types/ZAmbito";
import {Codigo} from "./Codigo";
import {FileLocation} from "./FileLocation";
import {desenvolver, generarEtiqueta, generarTemporal} from "../Utilidades";
import {obtenerTipoOperacionLogica, obtenerTipoOperacionLogicaUnaria} from "./TypeDefinition";
import {SemanticError} from "../types/SemanticError";


export class NodoAnd extends NodoAstPro{
    public readonly e1: NodoAst;
    public readonly e2: NodoAst;
    private readonly symbol: string;

    constructor(fileLocation: FileLocation, e1: NodoAst, e2: NodoAst) {
        super(fileLocation);
        this.e1 = e1;
        this.e2 = e2;
        this.symbol = '&&';
    }


    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const c1 = desenvolver(this.e1.generarCodigo(ambito));
        const c2 = desenvolver(this.e2.generarCodigo(ambito));

        const codigo = obtenerTipoOperacionLogica(c1,c2);

        if(codigo === undefined){
            throw new SemanticError(`Error de tipos operacion ${c1.tipo.nombre} ${this.symbol} ${c2.tipo.nombre} `);

        }


        codigo.eTrue = generarEtiqueta();
        codigo.apuntador = generarTemporal();



        return codigo;


    }


}

export class NodoNot  extends NodoAstPro{
    public readonly e1: NodoAst;
    private readonly symbol: string;

    constructor(fileLocation: FileLocation, e1: NodoAst) {
        super(fileLocation);
        this.e1 = e1;
        this.symbol = '!';

    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const c1 = desenvolver(this.e1.generarCodigo(ambito));
        const codigo = obtenerTipoOperacionLogicaUnaria(c1);

        if(codigo === undefined){
            throw new SemanticError(`Error de tipos operacion  ${this.symbol} ${c1.tipo.nombre}`);
        }

        codigo.eFalse = c1.eTrue;
        codigo.eTrue = c1.eFalse;

        codigo.agregar(c1.texto);

        return codigo;

    }

}



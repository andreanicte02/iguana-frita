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

        const tipo = obtenerTipoOperacionLogica(c1,c2);

        if(tipo === undefined){
            throw new SemanticError(`Error de tipos operacion ${c1.tipo.nombre} ${this.symbol} ${c2.tipo.nombre} `);

        }

        const codigo = new Codigo();
        codigo.tipo = tipo;



        codigo.pasarEtiquetasFalsas(c1.eFalse);
        codigo.pasarEtiquetasFalsas(c2.eFalse);

        codigo.pasarEtiquetasVerdaderas(c2.eTrue);

        codigo.agregarCodigo(c1);
        codigo.agregar(`${c1.eTrue.reduce((a,x)=> a += "," + x )} :`);
        codigo.agregarCodigo(c2);

        return codigo;


    }


}

export class NodoOr extends NodoAstPro{
    public readonly e1: NodoAst;
    public readonly e2: NodoAst;
    private readonly symbol: string;

    constructor(fileLocation: FileLocation, e1: NodoAst, e2: NodoAst) {
        super(fileLocation);
        this.e1 = e1;
        this.e2 = e2;
        this.symbol = '||';
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const c1 = desenvolver(this.e1.generarCodigo(ambito));
        const c2 = desenvolver(this.e2.generarCodigo(ambito));

        const tipo = obtenerTipoOperacionLogica(c1,c2);

        if(tipo === undefined){
            throw new SemanticError(`Error de tipos operacion ${c1.tipo.nombre} ${this.symbol} ${c2.tipo.nombre} `);
        }
        const  codigo = new Codigo();
        codigo.tipo = tipo;

        
        codigo.eTrue = codigo.eTrue.concat(c1.eTrue,c2.eTrue);
        codigo.eFalse = codigo.eFalse.concat(c2.eFalse);

        codigo.pasarEtiquetasVerdaderas(c1.eTrue);
        codigo.pasarEtiquetasVerdaderas(c2.eTrue);

        codigo.pasarEtiquetasFalsas(c2.eFalse);

        codigo.agregarCodigo(c1);
        codigo.agregar(`${c1.eFalse.reduce((a,x)=> a += "," + x )} :`);
        codigo.agregarCodigo(c2);
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
        const tipo = obtenerTipoOperacionLogicaUnaria(c1);

        if(tipo === undefined){
            throw new SemanticError(`Error de tipos operacion  ${this.symbol} ${c1.tipo.nombre}`);
        }

        const codigo = new Codigo();

        codigo.eFalse = c1.eTrue;
        codigo.eTrue = c1.eFalse;

        codigo.agregar(c1.texto);

        return codigo;

    }

}



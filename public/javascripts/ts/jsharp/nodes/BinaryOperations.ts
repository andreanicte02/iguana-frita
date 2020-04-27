import {NodoAst, NodoAstPro} from "./NodoAst";
import {ZAmbito} from "../types/ZAmbito";
import {Codigo} from "./Codigo";
import {FileLocation} from "./FileLocation";
import {desenvolver, generarTemporal} from "../Utilidades";
import {arithmeticOperation} from "./TypeDefinition";
import {NTipo} from "../types/NTipo";
import {nTipoError} from "../types/TiposPrimitivos";
import {SemanticError} from "../types/SemanticError";


export class BinaryOperations extends NodoAstPro {
    public readonly e1: NodoAst;
    public readonly e2: NodoAst;
    private readonly symbol: string;

    constructor(fileLocation: FileLocation, e1: NodoAst, e2: NodoAst, symbol: string) {
        super(fileLocation);
        this.e1 = e1;
        this.e2 = e2;
        this.symbol = symbol;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const c1 = desenvolver(this.e1.generarCodigo(ambito));
        const c2 = desenvolver(this.e2.generarCodigo(ambito));


        const  codigo = new Codigo();
        codigo.tipo=arithmeticOperation(c1.tipo,c2.tipo);
        if(codigo.tipo === nTipoError){
            throw new SemanticError(`Error de tipos operacion ${c1.tipo.nombre} ${this.symbol} ${c2.tipo.nombre} `)
        }
        codigo.agregarCodigo(c1);
        codigo.agregarCodigo(c2);

        codigo.apuntador = generarTemporal();
        codigo.agregar(`${codigo.apuntador} = ${c1.apuntador} ${this.symbol} ${c2.apuntador}`);
        codigo.comentar(`${c1.extra} + ${c2.extra}`);
        codigo.extra = `${c1.extra} + ${c2.extra}`;
        return codigo;
    }

    
}



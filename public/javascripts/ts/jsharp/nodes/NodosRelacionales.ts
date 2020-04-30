import {NodoAst, NodoAstPro} from "./NodoAst";
import {FileLocation} from "./FileLocation";
import {ZAmbito} from "../types/ZAmbito";
import {Codigo} from "./Codigo";
import {desenvolver, generarEtiqueta, generarTemporal} from "../Utilidades";
import {obtenerTipoOperacionRelacional} from "./TypeDefinition";
import {SemanticError} from "../types/SemanticError";

export class NodoRelacional extends NodoAstPro{
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

        const codigo = obtenerTipoOperacionRelacional(c1, c2);

        if(codigo === undefined){
            throw new SemanticError(`Error de tipos operacion ${c1.tipo.nombre} ${this.symbol} ${c2.tipo.nombre} `);

        }

        codigo.agregarCodigo(c1);
        codigo.agregarCodigo(c2);

        codigo.eTrue = generarEtiqueta();
        codigo.eFalse = generarEtiqueta();
        codigo.eSalida = generarEtiqueta();
        codigo.apuntador = generarTemporal();

        codigo.agregar(`if  ${c1.apuntador} ${this.symbol} ${c2.apuntador} goto ${codigo.eTrue} ;`);
        codigo.agregar(`goto ${codigo.eFalse} ;`);

        /*
        codigo.agregar(`${codigo.eTrue}:`)
        codigo.agregar(`${codigo.apuntador} = 1 ;`)
        codigo.agregar(`goto ${codigo.eSalida}`)

        codigo.agregar(`${codigo.eFalse}:`)
        codigo.agregar(`${codigo.apuntador} = 0 ;`)



        codigo.agregar(`${codigo.eSalida}:`)
    */


        return codigo;


    }
}
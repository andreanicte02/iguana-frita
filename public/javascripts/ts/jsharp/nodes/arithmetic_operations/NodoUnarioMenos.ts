import {NodoAst, NodoAstPro} from "../NodoAst";
import {ZAmbito} from "../../types/ZAmbito";
import {Codigo} from "../Codigo";
import {FileLocation} from "../FileLocation";
import {desenvolver, generarTemporal} from "../../Utilidades";
import {obtenerTipoOperacionUnarioMenos} from "../TypeDefinition";
import {SemanticError} from "../../types/SemanticError";

export class NodoUnarioMenos extends NodoAstPro{

    public readonly e1: NodoAst;
    private readonly symbol: string;

    constructor(fileLocation: FileLocation, e1: NodoAst) {
        super(fileLocation);
        this.e1 = e1;
        this.symbol = "-";

    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {
        const c1 = desenvolver(this.e1.generarCodigo(ambito));

        const tipo = obtenerTipoOperacionUnarioMenos(c1);

        if(tipo === undefined){
            throw new SemanticError(`Error de tipos operacion  ${this.symbol} ${c1.tipo.nombre}`);
        }

        const codigo = new Codigo();
        codigo.tipo = tipo;
        codigo.agregarCodigo(c1);
        const temporalAuxiliar = generarTemporal();
        codigo.apuntador = generarTemporal();


        codigo.agregar(`${temporalAuxiliar} = 0 - 1`);
        codigo.agregar(`${codigo.apuntador} = ${temporalAuxiliar} * ${c1.apuntador} `);

        codigo.comentar(`${temporalAuxiliar}*${c1.extra}`);
        codigo.extra += `${temporalAuxiliar}*${c1.extra}`;



        return  codigo;



    }


}
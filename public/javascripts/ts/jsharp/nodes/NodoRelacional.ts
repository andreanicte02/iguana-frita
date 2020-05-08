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

    constructor(fileLocation: FileLocation,e1: NodoAst , symbol: string, e2: NodoAst) {
        super(fileLocation);
        this.e1 = e1;
        this.e2 = e2;
        this.symbol = symbol;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const c1 = desenvolver(this.e1.generarCodigo(ambito));
        const c2 = desenvolver(this.e2.generarCodigo(ambito));

        const  tipo = obtenerTipoOperacionRelacional(c1, c2);

        if(tipo === undefined){
            throw new SemanticError(`Error de tipos operacion ${c1.tipo.nombre} ${this.symbol} ${c2.tipo.nombre} `);

        }

        const codigo = new Codigo();
        codigo.tipo = tipo;

        codigo.agregarCodigo(c1);
        codigo.agregarCodigo(c2);

        const etiquetaV = generarEtiqueta();
        const etiquetaF = generarEtiqueta();

        codigo.guardarEtiquetaVerdadera(etiquetaV);
        codigo.guardarEtiquetaFalsa(etiquetaF);


        codigo.agregar(`if ${c1.apuntador} ${this.symbol} ${c2.apuntador} goto ${etiquetaV};`);
        codigo.agregar(`goto ${etiquetaF};`);

        codigo.extra+=`if ${c1.apuntador} ${this.symbol} ${c2.apuntador}`;
        codigo.comentar(`if ${c1.apuntador} ${this.symbol} ${c2.apuntador} - etiquetas true: ${codigo.eTrue.join(',')}`)
        codigo.comentar(`if ${c1.apuntador} ${this.symbol} ${c2.apuntador} - etiquetas false: ${codigo.eFalse.join(',')}`)

        return codigo;


    }
}
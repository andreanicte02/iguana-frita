import {NodoAst, NodoAstPro} from "../NodoAst";
import {ZAmbito} from "../../types/ZAmbito";
import {Codigo} from "../Codigo";
import {FileLocation} from "../FileLocation";
import {codigoIgualacionXValor} from "../TypeDefinition";


export class NodoIgualdadValor extends NodoAstPro{

    public readonly e1: NodoAst;
    public readonly e2: NodoAst;
    private readonly symbol: string;


    constructor(fileLocation: FileLocation,e1: NodoAst, e2: NodoAst) {
        super(fileLocation);
        this.e1 = e1;
        this.e2 = e2;
        this.symbol = '=='
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {


        return codigoIgualacionXValor(this.e1, this.symbol, this.e2, ambito);


    }

}
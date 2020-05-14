import {NodoAst, NodoAstPro} from "../NodoAst";
import {ZAmbito} from "../../types/ZAmbito";
import {Codigo} from "../Codigo";
import {FileLocation} from "../FileLocation";
import {desenvolver} from "../../Utilidades";
import {codigoInvocar} from "../../types/codigos";

export class NodoPotencia extends NodoAstPro {
    public readonly e1: NodoAst;
    public readonly e2: NodoAst;
    private readonly symbol: string;

    constructor(fileLocation: FileLocation, e1: NodoAst, e2: NodoAst) {
        super(fileLocation);
        this.e1 = e1;
        this.e2 = e2;
        this.symbol = "^^";
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const c1 = desenvolver(this.e1.generarCodigo(ambito));
        const c2 = desenvolver(this.e2.generarCodigo(ambito));


        return codigoInvocar(ambito, 'potencia', [c1, c2], false, true);


    }
}
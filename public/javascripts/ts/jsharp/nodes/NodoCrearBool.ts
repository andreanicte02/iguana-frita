import {NodoAstPro} from "./NodoAst";
import {ZAmbito} from "../types/ZAmbito";
import {Codigo} from "./Codigo";
import {FileLocation} from "./FileLocation";
import {nTipoBoolean} from "../types/TiposPrimitivos";
import {generarEtiqueta, generarTemporal} from "../Utilidades";

export class NodoCrearBool extends NodoAstPro{

    private readonly val: boolean;
    constructor(fileLocation: FileLocation, val: boolean) {
        super(fileLocation);
        this.val = val;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const codigo = new Codigo();
        codigo.tipo = nTipoBoolean;
        codigo.eTrue = generarEtiqueta();
        codigo.eFalse = generarEtiqueta();
        codigo.apuntador = generarTemporal();


        if(this.val){
            codigo.agregar( `goto ${codigo.eTrue}`);
            codigo.comentar('true')

        }else{
            codigo.agregar(`goto ${codigo.eFalse}`);
            codigo.comentar( 'false' );
        }

        return codigo;
    }
    
}
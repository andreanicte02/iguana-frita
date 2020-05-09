import {NodoAstPro} from "../NodoAst";
import {FileLocation} from "../FileLocation";
import {ZAmbito} from "../../types/ZAmbito";
import {Codigo} from "../Codigo";
import {buscarEnCadenaAmbito} from "../../types/codigos";
import {SemanticError} from "../../types/SemanticError";

export class NodoContinue extends NodoAstPro{

    constructor(fileLocation: FileLocation) {
        super(fileLocation);
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const codigo = new Codigo();
        const labelInicio = buscarEnCadenaAmbito<string>(ambito, a=> a.labelInicio);

        if(labelInicio === undefined){
            throw new SemanticError('no se encuentra en bucle')
        }

        codigo.agregar(`goto ${labelInicio};`)
        codigo.comentar(`continue`);

        return codigo;
    }

}
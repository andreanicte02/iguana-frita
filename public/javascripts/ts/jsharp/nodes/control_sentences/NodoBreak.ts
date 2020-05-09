import {NodoAstPro} from "../NodoAst";
import {FileLocation} from "../FileLocation";
import {ZAmbito} from "../../types/ZAmbito";
import {Codigo} from "../Codigo";
import {buscarEnCadenaAmbito} from "../../types/codigos";
import {SemanticError} from "../../types/SemanticError";

export class NodoBreak extends NodoAstPro{

    constructor(fileLocation: FileLocation) {
        super(fileLocation);
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const codigo = new Codigo();
        const labelFin = buscarEnCadenaAmbito<string>(ambito, a=> a.labelFin);
        if(labelFin === undefined){
            throw new SemanticError('no se encuentra en bucle o un switch')
        }

        codigo.agregar(`goto ${labelFin};`)
        codigo.comentar(`break`);

        return codigo;
    }

}
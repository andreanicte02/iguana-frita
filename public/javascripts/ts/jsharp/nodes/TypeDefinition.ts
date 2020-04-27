import {NTipo} from "../types/NTipo";
import {nTipoDouble, nTipoEntero, nTipoError} from "../types/TiposPrimitivos";


export function arithmeticOperation(c1: NTipo, c2: NTipo ): NTipo {

    if(c1 === nTipoDouble && c2 === nTipoDouble){
        return nTipoDouble;
    }

    if(c1 === nTipoDouble && c2 == nTipoEntero){
        return nTipoDouble
    }


    if(c1 === nTipoEntero && c2 == nTipoDouble){
        return nTipoDouble
    }


    if(c1 === nTipoEntero && c2 === nTipoEntero){
        return nTipoEntero;
    }

    return nTipoError;
}

import {NTipo} from "../types/NTipo";
import {nTipoBooleanSombra, nTipoDouble, nTipoEntero} from "../types/TiposPrimitivos";
import {Codigo} from "./Codigo";

export function esBoleano(tipo: Codigo): boolean {

    if(tipo.tipo === nTipoBooleanSombra || tipo.tipo === nTipoBooleanSombra){
        return true;
    }

    return false;
}

export function obtenerTipoOperacionAritmetica(c1: Codigo, c2: Codigo ): NTipo  | undefined{


    if(c1.tipo === nTipoDouble && c2.tipo === nTipoDouble){

        return nTipoDouble;
    }

    if(c1.tipo === nTipoDouble && c2.tipo == nTipoEntero){

        return nTipoDouble;

    }


    if(c1.tipo === nTipoEntero && c2.tipo == nTipoDouble){

        return nTipoDouble;

    }


    if(c1.tipo === nTipoEntero && c2.tipo === nTipoEntero){

        return nTipoEntero;

    }

    return undefined;
}


export function obtenerTipoOperacionRelacional(c1: Codigo, c2: Codigo): NTipo | undefined {


    if(c1.tipo === nTipoDouble && c2.tipo === nTipoDouble){

        return nTipoBooleanSombra;
    }

    if(c1.tipo === nTipoDouble && c2.tipo === nTipoEntero){

        return nTipoBooleanSombra;

    }

    if(c1.tipo === nTipoEntero && c2.tipo === nTipoDouble){

        return nTipoBooleanSombra;

    }

    if(c1.tipo === nTipoEntero && c2.tipo === nTipoEntero){

        return nTipoBooleanSombra;

    }


    return undefined;
}


export function obtenerTipoOperacionLogica(c1: Codigo, c2: Codigo): NTipo | undefined{

    if(c1.tipo === nTipoBooleanSombra && c2.tipo === nTipoBooleanSombra){
        return nTipoBooleanSombra;
    }

    if(esBoleano(c1)){
        return undefined;
    }

    if (esBoleano(c2)){
        return undefined;
    }

    return nTipoBooleanSombra;
}

export function obtenerTipoOperacionLogicaUnaria(c1: Codigo): NTipo | undefined {

    if(esBoleano(c1)){
        return undefined;
    }


    return nTipoBooleanSombra;

}


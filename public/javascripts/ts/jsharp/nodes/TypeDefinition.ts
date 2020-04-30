import {NTipo} from "../types/NTipo";
import {nTipoBoolean, nTipoDouble, nTipoEntero} from "../types/TiposPrimitivos";
import {Codigo} from "./Codigo";


export function obtenerTipoOperacionAritmetica(c1: Codigo, c2: Codigo ): Codigo | undefined{

    const codigo = new Codigo();
    if(c1.tipo === nTipoDouble && c2.tipo === nTipoDouble){

        codigo.tipo = nTipoDouble;
        return codigo;
    }

    if(c1.tipo === nTipoDouble && c2.tipo == nTipoEntero){

        codigo.tipo = nTipoDouble;
        return codigo;

    }


    if(c1.tipo === nTipoEntero && c2.tipo == nTipoDouble){
        codigo.tipo = nTipoDouble;
        return codigo;

    }


    if(c1.tipo === nTipoEntero && c2.tipo === nTipoEntero){

        codigo.tipo = nTipoEntero;
        return codigo;

    }

    return undefined;
}


export function obtenerTipoOperacionRelacional(c1: Codigo, c2: Codigo): Codigo | undefined {

    const codigo = new Codigo();

    if(c1.tipo === nTipoDouble && c2.tipo === nTipoDouble){
        codigo.tipo = nTipoBoolean;
        return codigo;
    }

    if(c1.tipo === nTipoDouble && c2.tipo === nTipoEntero){
        codigo.tipo = nTipoBoolean;
        return codigo;
    }

    if(c1.tipo === nTipoEntero && c2.tipo === nTipoDouble){
        codigo.tipo = nTipoBoolean;
        return codigo;
    }

    if(c1.tipo === nTipoEntero && c2.tipo === nTipoEntero){
        codigo.tipo = nTipoBoolean;
        return codigo;
    }




    return undefined;
}


export function obtenerTipoOperacionLogica(c1: Codigo, c2: Codigo) {

    if(c1.tipo!= nTipoBoolean){
        return undefined;
    }

    if (c2.tipo != nTipoBoolean){
        return undefined;
    }

    const codigo = new Codigo();
    codigo.tipo = nTipoBoolean;
    return codigo;

}

export function obtenerTipoOperacionLogicaUnaria(c1: Codigo) {

    if(c1.tipo!= nTipoBoolean){
        return undefined;
    }

    const codigo = new Codigo();
    codigo.tipo = nTipoBoolean;
    return codigo;




}

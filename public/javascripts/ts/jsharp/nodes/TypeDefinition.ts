import {NTipo} from "../types/NTipo";
import {
    nTipoBooleanConEtiqueta,
    nTipoBooleanNormal,
    nTipoChar,
    nTipoDouble,
    nTipoEntero
} from "../types/TiposPrimitivos";
import {Codigo} from "./Codigo";
import {generarEtiqueta, generarTemporal} from "../Utilidades";

export function esBoleano(tipo: Codigo): boolean {

    if(tipo.tipo === nTipoBooleanConEtiqueta || tipo.tipo === nTipoBooleanConEtiqueta){
        return true;
    }

    return false;
}

export function esNumero(tipo: Codigo): boolean {

    if(tipo.tipo === nTipoDouble || tipo.tipo === nTipoEntero || tipo.tipo === nTipoChar){
        return true;
    }
    return false;
}

export function esCadena(tipo: Codigo): boolean {

    return  true;
}

export function obtenerTipoOperacionAritmeticaSimple(c1: Codigo, c2: Codigo ) {

    if(!esNumero(c1) && !esNumero(c2)){
        return undefined;
    }

    if(c1.tipo=== nTipoDouble || c2.tipo === nTipoDouble){
        return nTipoDouble;
    }

    if(c1.tipo === nTipoEntero || c2.tipo == nTipoEntero){

        return nTipoEntero;
    }

    return nTipoChar;


}

export function obtenerTipoOperacionAritmeticaSuma(c1: Codigo, c2: Codigo ): NTipo  | undefined{

    if(!(esNumero(c1) || esCadena(c1)) && !(esNumero(c2) || esCadena(c2))){
        return  undefined;
    }

    //solo faltaria la excuslion para el tipo cadena
    if(c1.tipo=== nTipoDouble || c2.tipo === nTipoDouble){
        return nTipoDouble;
    }

    if(c1.tipo === nTipoEntero || c2.tipo == nTipoEntero){

        return nTipoEntero;
    }

    return nTipoChar;

}


export function obtenerTipoOperacionRelacional(c1: Codigo, c2: Codigo): NTipo | undefined {


    if(esNumero(c1) && esNumero(c2)){

        //las relacionales siempre deberian de generar con etiquetas
        return nTipoBooleanConEtiqueta;

    }

    return undefined;
}



export function deBooleanoEtiquetaANormal(c1: Codigo): Codigo {

    const codigo = new Codigo();


    codigo.pasarEtiquetasFalsas(c1.eFalse);
    codigo.pasarEtiquetasVerdaderas(c1.eTrue);

    codigo.tipo = nTipoBooleanNormal;
    codigo.apuntador = generarTemporal();

    codigo.agregarCodigo(c1);

    const eSalida = generarEtiqueta();
    codigo.agregar(`${c1.eTrue.join(',')} :`);
    codigo.agregar(`${codigo.apuntador} = 1`);
    codigo.agregar(`goto ${eSalida}`);
    codigo.agregar(`${c1.eFalse.join(',')} :`);
    codigo.agregar(`${codigo.apuntador} = 0`);
    codigo.agregar(`${eSalida} :`);
    return codigo;
}

export function deBolleanoNormalAEtiqueta(c1: Codigo): Codigo {
    const  codigo = new Codigo();
    codigo.tipo = nTipoBooleanConEtiqueta;
    codigo.apuntador = c1.apuntador;
    const etiquetaV = generarEtiqueta();
    const etiquetaF = generarEtiqueta();

    codigo.guardarEtiquetaVerdadera(etiquetaV);
    codigo.guardarEtiquetaFalsa(etiquetaF);

    codigo.agregar(`if ${c1.apuntador} == 1 goto ${etiquetaV}`)
    codigo.agregar(`go to ${etiquetaF}`)


    return codigo;
}




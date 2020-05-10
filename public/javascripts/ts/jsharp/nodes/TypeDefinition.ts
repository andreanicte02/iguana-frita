import {NTipo} from "../types/NTipo";
import {
    nTipoBooleanConEtiqueta,
    nTipoBooleanNormal,
    nTipoChar,
    nTipoDouble,
    nTipoEntero
} from "../types/TiposPrimitivos";
import {Codigo} from "./Codigo";
import {desenvolver, generarEtiqueta, generarTemporal} from "../Utilidades";
import {SemanticError} from "../types/SemanticError";
import {NodoAst} from "./NodoAst";
import {ZAmbito} from "../types/ZAmbito";

export function esBoleano(tipo: Codigo): boolean {

    if(tipo.tipo === nTipoBooleanConEtiqueta || tipo.tipo === nTipoBooleanNormal){
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

    if(!esNumero(c1)){
        return undefined;
    }


    if(!esNumero(c2)){
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

export function obtenerTipoAritmeticoModular(c1: Codigo, c2: Codigo) {
    if(c1.tipo === nTipoEntero && c2.tipo === nTipoEntero){
        return nTipoEntero;
    }
    return  undefined;

}

export function obtenerTipoOperacionAritmeticaSuma(c1: Codigo, c2: Codigo ): NTipo  | undefined{

    if(!(esNumero(c1))){
        return  undefined;
    }

    if(!(esNumero(c2))){
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

export function obtenerTipoOperacionUnarioMenos(c1: Codigo): NTipo | undefined {
    if(c1.tipo === nTipoEntero || c1.tipo === nTipoDouble){

        return c1.tipo;

    }

    return undefined;
}

export function obtenerTipoIgualdadRelacionalxValor(c1: Codigo , c2: Codigo): NTipo | undefined {

    if(esNumero(c1) && esNumero(c2)){
        return nTipoBooleanConEtiqueta;
    }

    if(esBoleano(c1) && esBoleano(c2)){
        return nTipoBooleanConEtiqueta;
    }

    //todo falta el manejo de strings

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
    codigo.agregar(`${codigo.eTrue.join(':\n')}:`);
    codigo.agregar(`${codigo.apuntador} = 1 ;`);

    codigo.comentar(`if ${codigo.apuntador} == 1 goto - etiquetas true: ${codigo.eTrue.join(',')}` )

    codigo.agregar(`goto ${eSalida};`);
    codigo.agregar(`${codigo.eFalse.join(':\n')}:`);
    codigo.agregar(`${codigo.apuntador} = 0 ;`);

    codigo.comentar(`if ${codigo.apuntador} == 0 goto - etiquetas false: ${codigo.eFalse.join(',')}` )


    codigo.agregar(`${eSalida} :`);

    codigo.comentar('de bool normal a eitiqueta')

    codigo.extra=`${codigo.apuntador} = 1 | 0`;




    return codigo;
}

export function esPrimitivo(codigo: Codigo): boolean {

    if(esNumero(codigo) || esBoleano(codigo) ){
        return true;
    }

    return false;
}

export function deBooleanoEtiquetaANormalCondicional(codigo: Codigo): Codigo {
    if (codigo.tipo == nTipoBooleanConEtiqueta) {
        return deBooleanoEtiquetaANormal(codigo);
    }
    return codigo;
}
export function esIgualValor(e1: NodoAst, symbol: string , e2: NodoAst, ambito: ZAmbito): Codigo {


    const c1 = desenvolver(e1.generarCodigo(ambito));
    const c2 = desenvolver(e2.generarCodigo(ambito));

    //TODO falta el manejo de strings
    const tipo = obtenerTipoIgualdadRelacionalxValor(c1,c2);

    if(tipo === undefined){

        throw new SemanticError(`No se permiten tipos no primitivos  ${c1.tipo.nombre} ${symbol} ${c2.tipo.nombre}`)

    }

    const aux1 = c1.tipo === nTipoBooleanConEtiqueta ?deBooleanoEtiquetaANormal(c1): c1;
    const aux2 = c2.tipo === nTipoBooleanConEtiqueta ?deBooleanoEtiquetaANormal(c2): c2;


    const etiquetaVerdadera = generarEtiqueta();
    const etiquetaFalsa = generarEtiqueta();

    const codigo = new Codigo();
    codigo.guardarEtiquetaVerdadera(etiquetaVerdadera);
    codigo.guardarEtiquetaFalsa(etiquetaFalsa);

    codigo.agregarCodigo(aux1);
    codigo.agregarCodigo(aux2);
    codigo.tipo = nTipoBooleanConEtiqueta;

    codigo.agregar(`if (${aux1.apuntador} ${symbol} ${aux2.apuntador}) goto ${etiquetaVerdadera};`);
    codigo.comentar(`if ${aux1.apuntador} ${symbol} ${aux2.apuntador} - etiquetas true: ${codigo.eTrue.join(',')}`)


    codigo.agregar(`goto ${etiquetaFalsa};`)
    codigo.comentar(`if ${aux1.apuntador} ${symbol} ${aux2.apuntador} - etiquetas false: ${codigo.eFalse.join(',')}`)


    codigo.extra+=`if ${aux1.apuntador} ${symbol} ${aux2.apuntador}`;

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

    codigo.agregar(`if (${c1.apuntador} == 1) goto ${etiquetaV} ;`)
    codigo.agregar(`goto ${etiquetaF} ;`)


    codigo.comentar('de bool etiqueta a normal')
    codigo.extra+= `${c1.apuntador} == 1`
    codigo.comentar(`if ${c1.apuntador} == 1 goto - etiquetas true: ${etiquetaV}` )
    codigo.comentar(`if ${c1.apuntador} == 1 goto - etiquetas false: ${etiquetaF}` )

    return codigo;
}




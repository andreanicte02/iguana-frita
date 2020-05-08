import {Codigo} from "./nodes/Codigo.js";
import {NodoAst} from "./nodes/NodoAst.js";
import {ZAmbito} from "./types/ZAmbito.js";
import {NTipo, NTipoVar} from "./types/NTipo";
import { buscarEnCadenaAmbito } from "./types/codigos.js";
import { NodoDeclararVarTipo5 } from "./nodes/NodoDeclararVarTipo5.js";
import {NodoDeclararVarTipo1} from "./nodes/NodoDeclararVarTipo1.js";
import {NodoDeclararEstructura} from "./nodes/NodoDeclararEstructura.js";
import {NodoDeclararFuncion} from "./nodes/NodoDeclararFuncion.js";


export const inicio = {
    contadorTemporales: -1,
    contadorEtiquetas: -1,
    contadorEstructuras: -1,
};

export function reiniciarContadores(): void {
    inicio.contadorEtiquetas = -1;
    inicio.contadorTemporales = -1;
    inicio.contadorEstructuras = -1;
}



export function getTextoDeclaracionTemporales(): string {
    let cont = 0;
    const arreglo: string[] = [];
    while (cont<= inicio.contadorTemporales){

        arreglo.push(`t${cont}`);
        cont+=1;
    }

    return arreglo.join(',');
}

export function generarTemporal(): string {
    inicio.contadorTemporales += 1;
    return `t${inicio.contadorTemporales}`;
}

export function generarEtiqueta(): string {
    inicio.contadorEtiquetas += 1;
    return `L${inicio.contadorEtiquetas}`;
}

export function desenvolver(codigo: Codigo): Codigo {
    // TODO: agregar logica

    if(codigo.tipo instanceof NTipoVar){

        const c1 = new Codigo();
        c1.agregarCodigo(codigo);
        c1.apuntador = generarTemporal();
        c1.agregar(`${c1.apuntador} = ${codigo.acceso};`);
        c1.tipo = codigo.tipo.tipoContenido;

        c1.extra = `${codigo.extra}`
        c1.comentar(`${c1.apuntador} = ${codigo.extra}`);

        return c1;
    }

    return codigo;
}

function esDeclaracion(sentencia: NodoAst): boolean {
    return sentencia instanceof NodoDeclararEstructura || sentencia instanceof NodoDeclararFuncion;
}

export function codigoGenerarBloque(sentencias: NodoAst[], ambito: ZAmbito): Codigo {
    const codigo = new Codigo();

    const nodosDeclaracion = sentencias.filter(s => !esDeclaracion(s));
    const nodosOtros = sentencias.filter(s => esDeclaracion(s));

    nodosOtros
        .map(sentencia => sentencia.generarCodigo(ambito))
        .forEach(c => {
            codigo.agregarCodigo(c)
        });

    ambito.inicializarTipos();

    nodosDeclaracion
        .map(sentencia => sentencia.generarCodigo(ambito))
        .forEach(c => {
            codigo.agregarCodigo(c)
        });

    // const codigoFunciones = ambito.generarCodigoFunciones();
    // codigo.agregarCodigo(codigoFunciones);

    return codigo;
}

// export function codigoGenerarBloqueExtras(sentencias: NodoAst[], ambito: ZAmbito): Codigo {
//
//     const codigoFunciones = ambito.generarCodigoFunciones();
// }

export function obtenerEspacioOcupadoEnFuncionExclusivo(ambito: ZAmbito): number {

    let espacioOcupado = 0;
    for (
        let temporal = ambito.padre;
        temporal?.padre !== undefined;
        temporal = temporal.padre
    ) {
        espacioOcupado += temporal.espacioEnMemoria;
    }
    return espacioOcupado;
}

export function obtenerEspacioOcupadoEnFuncion(ambito: ZAmbito): number {
    // en el ambito global, no se tiene espacio utilizado en el stack
    if (ambito.padre === undefined) return 0;

    let espacioOcupado = 0;
    buscarEnCadenaAmbito<boolean>(ambito, a => {
        espacioOcupado += a.espacioEnMemoria;
        return a.esOrigenFuncion;
    });
    return espacioOcupado;
}

export function generarNombreConstructor(tipo: NTipo): string {
    return `init_${tipo.id}_${tipo.nombre}`;
}

export function generarNombreProc(nombre: string, tipos: NTipo[]): string {
    const parametros = tipos.map(tipo => tipo.nombre).join("_");
    return `fun_${nombre}_${parametros}`;
}
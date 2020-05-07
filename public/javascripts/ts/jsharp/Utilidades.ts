import {Codigo} from "./nodes/Codigo.js";
import {NodoAst} from "./nodes/NodoAst.js";
import {ZAmbito} from "./types/ZAmbito.js";
import {NTipo, NTipoVar} from "./types/NTipo";
import { buscarEnCadenaAmbito } from "./types/codigos.js";


const inicio = {
    contadorTemporales: -1,
    contadorEtiquetas: -1,
};

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
        c1.agregar(`${c1.apuntador} = ${codigo.acceso}`);
        c1.tipo = codigo.tipo.tipoContenido;


        c1.extra += `${c1.apuntador} = ${codigo.acceso}`
        c1.comentar(`${c1.apuntador} = ${codigo.acceso}`);

        return c1;
    }

    return codigo;
}

export function codigoGenerarBloque(sentencias: NodoAst[], ambito: ZAmbito): Codigo {
    const codigo = new Codigo();

    sentencias
        .map(sentencia => sentencia.generarCodigo(ambito))
        .forEach(c => {
            codigo.agregarCodigo(c)
        });

    ambito.inicializarTipos();

    const codigoFunciones = ambito.generarCodigoFunciones();
    codigo.agregarCodigo(codigoFunciones);

    return codigo;
}

export function obtenerEspacioOcupadoEnFuncion(ambito: ZAmbito): number {
    let espacioOcupado = 0;
    buscarEnCadenaAmbito<boolean>(ambito, a => {
        espacioOcupado += a.espacioEnMemoria;
        return a.esOrigenFuncion;
    });
    return espacioOcupado;
}

export function generarNombreProc(nombre: string, tipos: NTipo[]): string {
    const parametros = tipos.map(tipo => tipo.nombre).join("_");
    return `fun_${nombre}_${parametros}`;
}
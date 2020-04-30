import {Codigo} from "./nodes/Codigo.js";


const inicio = {
    contadorTemporales: -1,
    contadorEtiquetas: -1,
};


export function desenvolver(codigo: Codigo): Codigo {
    // TODO: agregar logica
    return codigo;
}

export function generarTemporal(): string {
    inicio.contadorTemporales += 1;
    return `t${inicio.contadorTemporales}`;
}

export function generarEtiqueta(): string {
    inicio.contadorEtiquetas += 1;
    return `L${inicio.contadorEtiquetas}`;
}


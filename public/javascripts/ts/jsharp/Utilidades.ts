import {Codigo} from "./nodes/Codigo.js";
import {NodoAst} from "./nodes/NodoAst.js";
import {ZAmbito} from "./types/ZAmbito.js";


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

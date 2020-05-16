import {Codigo, GestorTemp} from "./nodes/Codigo.js";
import {NodoAst} from "./nodes/NodoAst.js";
import {ZAmbito} from "./types/ZAmbito.js";
import {NTipo, NTipoArreglo, NTipoVar} from "./types/NTipo";
import { buscarEnCadenaAmbito } from "./types/codigos.js";
import {NodoDeclararEstructura} from "./nodes/NodoDeclararEstructura.js";
import {NodoDeclararFuncion} from "./nodes/NodoDeclararFuncion.js";
import {nTipoEntero} from "./types/TiposPrimitivos.js";
import {NombreVars} from "./NombreVars";


export const inicio = {
    contadorTemporales: -1,
    contadorEtiquetas: -1,
    contadorEstructuras: -1,
};

export  const tablaSimbolos: NombreVars[] = [];
//private static Dictionary<string, ZEntorno> _bancoTiposArray = new Dictionary<string, ZEntorno>();

export const bancoTiposArray: NTipoArreglo[] = [];

export function guardarTablaSimbolos(nombre: string, tipo: string, fila: number, columna: number, path: string, array='') {

    tablaSimbolos.push(new NombreVars(nombre,
        tipo,fila, columna,path,array));

}

export function obtenerTipoDesdeBancoArray(tipoContenido: NTipo): NTipoArreglo
{
    const tipoArrayExistente = bancoTiposArray.find(t => t.tipoContenido === tipoContenido)
    if (tipoArrayExistente !== undefined) {
        return tipoArrayExistente;
    }
    const tipoArray = new NTipoArreglo(tipoContenido);
    tipoArray.declararPropiedades();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    tipoArray.ambito!.declararPropiedad('length', new NTipoVar(nTipoEntero))

    bancoTiposArray.push(tipoArray);
    return tipoArray;
}

export function reiniciarContadores(): void {
    inicio.contadorEtiquetas = -1;
    inicio.contadorTemporales = -1;
    inicio.contadorEstructuras = -1;
}



export function getTextoDeclaracionTemporales(): string {

    const lineas: string[] = [];

    let linea = '';
    let separador = '';
    for (let i = 0; i <= inicio.contadorTemporales; i++) {
        if (linea.length > 50) {
            lineas.push(linea);
            linea = '';
        }
        linea += separador + `t${i}`;
        separador = ', ';
    }
    lineas.push(linea);

    if (inicio.contadorTemporales < 0) return '';

    return `var ${lineas.join('\n')};`;
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

function esDeclaracionImportante(sentencia: NodoAst): boolean {
    return sentencia instanceof NodoDeclararEstructura || sentencia instanceof NodoDeclararFuncion;
}

export function codigoGenerarBloque(sentencias: NodoAst[], ambito: ZAmbito): Codigo {
    const codigo = new Codigo();

    const nodosDeclaracion = sentencias.filter(s => esDeclaracionImportante(s));
    const nodosOtros = sentencias.filter(s => !esDeclaracionImportante(s));

    nodosDeclaracion
        .map(sentencia => sentencia.generarCodigo(ambito))
        .forEach(c => {
            GestorTemp.limpiar();
            codigo.agregarCodigo(c)
        });

    ambito.inicializarTipos();

    nodosOtros
        .map(sentencia => sentencia.generarCodigo(ambito))
        .forEach(c => {
            GestorTemp.limpiar();
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
    return `init_${tipo.id}_${tipo.nombre}`.toLowerCase();
}

export function generarNombreProc(nombre: string, tipos: NTipo[], especial: boolean): string {
    const parametros = tipos.map(tipo => tipo.nombrePlano).join("_");
    const prefijo = especial? `nat` : `fun`;
    return `${prefijo}_${nombre}_${parametros}`.toLowerCase();
}
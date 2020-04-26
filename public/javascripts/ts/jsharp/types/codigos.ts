import {Codigo} from "../nodes/Codigo.js";
import {SemanticError} from "./SemanticError.js";
import {NTipoVar} from "./NTipo.js";
import {ZAmbito} from "./ZAmbito.js";
import {generarTemporal} from "../Utilidades.js";


export function codigoObtenerVar(ambito: ZAmbito, nombre: string): Codigo {

    for (
        let temporal: ZAmbito | undefined = ambito;
        temporal !== undefined;
        temporal = temporal!.padre
    ) {

        // TODO: falta agregar logica de ambitos anidados, y ambito global

        const [indice, tipoVar] = ambito.buscarPropiedadConDireccionRelativa(nombre);
        if (tipoVar === undefined) continue;

        const codigo = new Codigo();
        codigo.apuntador = generarTemporal();
        codigo.agregar(`${codigo.apuntador} = P + ${indice};`);
        codigo.comentar(`&${nombre}`);
        codigo.acceso = `stack[${codigo.apuntador}]`;
        codigo.tipo = tipoVar;
        return codigo;

    }

    throw new SemanticError(`Variable ${nombre} no declarada`)
}

export function codigoAsignar(codigoDestino: Codigo, codigoValor: Codigo): Codigo {

    if (!(codigoDestino.tipo instanceof NTipoVar)) throw new SemanticError(`Lado izquierdo de asignacion no es una variable: ${codigoDestino.tipo.nombre}`);
    const variableTipo = codigoDestino.tipo.tipoContenido;
    if (variableTipo !== codigoValor.tipo) throw new SemanticError(`No se puede guardar tipo ${codigoValor.tipo.nombre} en variable de tipo ${variableTipo.nombre}`);

    const codigo = new Codigo();
    codigo.agregarCodigo(codigoDestino);
    codigo.agregarCodigo(codigoValor);

    codigo.agregar(`${codigoDestino.acceso} = ${codigoValor.apuntador};`);
    codigo.comentar(`${codigoDestino.extra} = ${codigoValor.extra}`);
    return codigo;
}
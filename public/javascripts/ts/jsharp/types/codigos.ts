import {Codigo} from "../nodes/Codigo.js";
import {SemanticError} from "./SemanticError.js";
import {NTipo, NTipoVar} from "./NTipo.js";
import {ZAmbito} from "./ZAmbito.js";
import {desenvolver, generarTemporal} from "../Utilidades.js";
import {NFuncion} from "./NFuncion.js";


/**
 * Itera sobre la cadena de ambitos y va ejecutando la accion suministrada,
 * se detiene solamente si se regresa un valor diferente de `undefined`
 * @param ambito del cual comienza a buscar
 * @param accion
 */
function buscarEnCadenaAmbito<T>(
    ambito: ZAmbito,
    accion: (a: ZAmbito) => T | undefined,
): T | undefined {
  for (
      let temporal: ZAmbito | undefined = ambito;
      temporal !== undefined;
      temporal = temporal.padre
  ) {
    const result = accion(temporal);
    if (result) {
      return result;
    }
  }
  return undefined;
}

export function codigoObtenerTipo(ambito: ZAmbito, nombre: string): Codigo {
  const nTipo = buscarEnCadenaAmbito<NTipo>(ambito, a => a.buscarTipo(nombre));

  if (nTipo === undefined) {
    throw new SemanticError(`No se encontro el tipo ${nombre}`);
  }

  const codigo = new Codigo();
  codigo.tipo = nTipo;
  return codigo;
}


function codigoObtenerVarDeStackConTupla(nombre: string, tupla: {indice: number; nTipoVar: NTipoVar}): Codigo {
  const codigo = new Codigo();
  codigo.apuntador = generarTemporal();
  codigo.agregar(`${codigo.apuntador} = P + ${tupla.indice};`);
  codigo.comentar(`&${nombre}`);
  codigo.acceso = `stack[${codigo.apuntador}]`;
  codigo.tipo = tupla.nTipoVar;
  return codigo;
}

function codigoObtenerVarDeHeapConTupla(nombre: string, apuntadorOrigen: string, tupla: {indice: number; nTipoVar: NTipoVar}): Codigo {
  const codigo = new Codigo();
  codigo.apuntador = generarTemporal();
  codigo.agregar(`${codigo.apuntador} = ${apuntadorOrigen} + ${tupla.indice};`);
  codigo.comentar(`&${nombre}`);
  codigo.acceso = `heap[${codigo.apuntador}]`;
  codigo.tipo = tupla.nTipoVar;
  return codigo;
}

// export function codigoObtenerPropiedadExclusivo(apuntadorOrigen: string, nTipo: NTipo, nombreAtributo: string): Codigo {
//
//   if (nTipo.ambito === undefined) throw new Error('ambito de tipo no fue inicializado');
//   const tupla = nTipo.ambito.buscarPropiedadConDireccionRelativa(nombreAtributo);
//
//   if (tupla === undefined) throw new SemanticError(`Atributo ${nombreAtributo} no esta definido en instancias de tipo ${nTipo.nombre}`);
//
//   return codigoObtenerVarDeHeapConTupla(nombreAtributo, apuntadorOrigen, tupla);
// }
export function codigoObtenerPropiedad(codigoOrigen: Codigo, nombreAtributo: string): Codigo {

  if (codigoOrigen.tipo.ambito === undefined) throw new Error('ambito de tipo no fue inicializado');
  const tupla = codigoOrigen.tipo.ambito.buscarPropiedadConDireccionRelativa(nombreAtributo);

  if (tupla === undefined) throw new SemanticError(`Atributo ${nombreAtributo} no esta definido en instancias de tipo ${codigoOrigen.tipo.nombre}`);

  return codigoObtenerVarDeHeapConTupla(nombreAtributo, codigoOrigen.apuntador, tupla);
}

export function codigoObtenerVar(ambito: ZAmbito, nombre: string): Codigo {

  const tupla = buscarEnCadenaAmbito<{indice: number; nTipoVar: NTipoVar}>(
      ambito,
      a => a.buscarPropiedadConDireccionRelativa(nombre),
  );

  if (tupla === undefined) {
    // verificamos si estamos en un constructor
    const tuplaInstanciaNueva = ambito.buscarPropiedadConDireccionRelativa(NFuncion.INSTANCIA);
    if (tuplaInstanciaNueva === undefined) throw new SemanticError(`Variable ${nombre} no declarada`);

    // se hace referencia a una propiedad dentro de una estructura.
    const codigoReferenciaInstancia = codigoObtenerVarDeStackConTupla(NFuncion.INSTANCIA, tuplaInstanciaNueva);
    const codigoDireccionInstancia = desenvolver(codigoReferenciaInstancia);
    return codigoObtenerPropiedad(codigoDireccionInstancia, nombre);
  }

  return codigoObtenerVarDeStackConTupla(nombre, tupla);
}






export function codigoAsignar(
  codigoDestino: Codigo,
  codigoValor: Codigo
): Codigo {
  if (!(codigoDestino.tipo instanceof NTipoVar))
    throw new SemanticError(
      `Lado izquierdo de asignacion no es una variable: ${codigoDestino.tipo.nombre}`
    );
  const variableTipo = codigoDestino.tipo.tipoContenido;
  if (variableTipo !== codigoValor.tipo)
    throw new SemanticError(
      `No se puede guardar tipo ${codigoValor.tipo.nombre} en variable de tipo ${variableTipo.nombre}`
    );

  const codigo = new Codigo();
  codigo.agregarCodigo(codigoDestino);
  codigo.agregarCodigo(codigoValor);

  //acceso stack[adf]
  codigo.agregar(`${codigoDestino.acceso} = ${codigoValor.apuntador};`);
  codigo.comentar(`${codigoDestino.extra} = ${codigoValor.extra}`);
  return codigo;
}
//codigo operacion binaria armietica

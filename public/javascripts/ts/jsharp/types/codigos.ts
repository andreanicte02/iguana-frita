import { Codigo } from "../nodes/Codigo.js";
import { SemanticError } from "./SemanticError.js";
import {NTipo, NTipoVar} from "./NTipo.js";
import { ZAmbito } from "./ZAmbito.js";
import { generarTemporal } from "../Utilidades.js";


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
      temporal = temporal!.padre
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

export function codigoObtenerVar(ambito: ZAmbito, nombre: string): Codigo {


  const tupla = buscarEnCadenaAmbito<{indice: number; nTipoVar: NTipoVar}>(
      ambito,
      a => a.buscarPropiedadConDireccionRelativa(nombre),
  );

  if (tupla === undefined) {
    throw new SemanticError(`Variable ${nombre} no declarada`);
  }

  // TODO: falta agregar logica de ambitos anidados, y ambito global

  const codigo = new Codigo();
  codigo.apuntador = generarTemporal();
  codigo.agregar(`${codigo.apuntador} = P + ${tupla.indice};`);
  codigo.comentar(`&${nombre}`);
  codigo.acceso = `stack[${codigo.apuntador}]`;
  codigo.tipo = tupla.nTipoVar;
  return codigo;

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

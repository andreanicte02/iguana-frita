import {Codigo, GestorTemp} from "../nodes/Codigo.js";
import {SemanticError} from "./SemanticError.js";
import {NTipo, NTipoVar} from "./NTipo.js";
import {ZAmbito} from "./ZAmbito.js";
import {desenvolver, generarNombreProc, generarTemporal, obtenerEspacioOcupadoEnFuncion} from "../Utilidades.js";
import {NFuncion} from "./NFuncion.js";
import {nTipoBooleanConEtiqueta, nTipoVoid} from "./TiposPrimitivos";
import {deBooleanoEtiquetaANormal, deBooleanoEtiquetaANormalCondicional} from "../nodes/TypeDefinition";


/**
 * Itera sobre la cadena de ambitos y va ejecutando la accion suministrada,
 * se detiene solamente si se regresa un valor diferente de `undefined`
 * @param ambito del cual comienza a buscar
 * @param accion
 */
export function buscarEnCadenaAmbito<T>(
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

function codigoObtenerVarGlobalConTupla(nombre: string, tupla: {indice: number; nTipoVar: NTipoVar}): Codigo {
  const codigo = new Codigo();
  codigo.acceso = `stack[${tupla.indice + 1}]`;
  codigo.tipo = tupla.nTipoVar;
  codigo.extra = `${nombre}`;
  return codigo;
}
function codigoObtenerVarDeStackConTupla(nombre: string, tupla: {indice: number; nTipoVar: NTipoVar}): Codigo {
  const codigo = new Codigo();
  codigo.apuntador = generarTemporal();
  codigo.agregar(`${codigo.apuntador} = P + ${tupla.indice};`);
  codigo.comentar(`&${nombre}`);
  codigo.acceso = `stack[${codigo.apuntador}]`;
  codigo.tipo = tupla.nTipoVar;
  codigo.extra = `${nombre}`;
  return codigo;
}

function codigoObtenerVarDeHeapConTuplaExclusivo(nombre: string, apuntadorOrigen: string, tupla: {indice: number; nTipoVar: NTipoVar}): Codigo {
  const codigo = new Codigo();
  codigo.apuntador = generarTemporal();
  codigo.agregar(`${codigo.apuntador} = ${apuntadorOrigen} + ${tupla.indice};`);
  codigo.comentar(`&${nombre}`);
  codigo.acceso = `heap[${codigo.apuntador}]`;
  codigo.tipo = tupla.nTipoVar;
  codigo.extra = `${nombre}`;
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

  const codigoHeap = codigoObtenerVarDeHeapConTuplaExclusivo(nombreAtributo, codigoOrigen.apuntador, tupla);

  const codigo = new Codigo();
  codigo.agregarCodigo(codigoOrigen);
  codigo.agregarCodigo(codigoHeap);

  codigo.tipo = codigoHeap.tipo;
  codigo.apuntador = codigoHeap.apuntador;
  codigo.acceso = codigoHeap.acceso;
  codigo.extra = codigoHeap.extra;
  return codigo;
}

export function codigoObtenerVar(ambito: ZAmbito, nombre: string): Codigo {

  let esGlobal = false;

  const tupla = buscarEnCadenaAmbito<{indice: number; nTipoVar: NTipoVar}>(
      ambito,
          a => {
            esGlobal = a.padre === undefined;
            return a.buscarPropiedadConDireccionRelativa(nombre)
          },
  );

  if (tupla === undefined) {
    // Este bloque es algo raro, pero es un caso especial que ocurre en los constructores.
    // Verificamos si estamos en un constructor
    const tuplaInstanciaNueva = ambito.buscarPropiedadConDireccionRelativa(NFuncion.INSTANCIA);
    if (tuplaInstanciaNueva === undefined) throw new SemanticError(`Variable ${nombre} no declarada`);

    // En un constructor se hace referencia al atributo que se desea inicializar de una manera 'indirecta'.
    // Se hace referencia a una propiedad dentro de una estructura.
    const codigoReferenciaInstancia = codigoObtenerVarDeStackConTupla(NFuncion.INSTANCIA, tuplaInstanciaNueva);
    const codigoDireccionInstancia = desenvolver(codigoReferenciaInstancia);
    return codigoObtenerPropiedad(codigoDireccionInstancia, nombre);
  }

  if (esGlobal) {
    return codigoObtenerVarGlobalConTupla(nombre, tupla);
  }

  return codigoObtenerVarDeStackConTupla(nombre, tupla);
}


/**
 *
 * @param codigoDestino
 * @param codigoValor
 * @param exclusivo Si `false` (default) se comportara de manera normal, si es `true` no realizara ningun proceso que absorba a codigoValor
 */
export function codigoAsignar(
  codigoDestino: Codigo,
  codigoValor: Codigo,
  exclusivo = false,
): Codigo {

  const codigoValorAux = exclusivo? codigoValor: deBooleanoEtiquetaANormalCondicional(codigoValor);

  if (!(codigoDestino.tipo instanceof NTipoVar))
    throw new SemanticError(
      `Lado izquierdo de asignacion no es una variable: ${codigoDestino.tipo.nombre}`
    );
  const variableTipo = codigoDestino.tipo.tipoContenido;
  if (variableTipo !== codigoValorAux.tipo)
    throw new SemanticError(
      `No se puede guardar tipo ${codigoValorAux.tipo.nombre} en variable de tipo ${variableTipo.nombre}`
    );

  const codigo = new Codigo();
  codigo.agregarCodigo(codigoDestino);
  if (!exclusivo) {
    codigo.agregarCodigo(codigoValorAux);
  }

  //acceso stack[adf]
  codigo.agregar(`${codigoDestino.acceso} = ${codigoValorAux.apuntador};`);
  codigo.comentar(`${codigoDestino.extra} = ${codigoValorAux.extra}`);
  return codigo;
}

function buscarNFuncion(ambito: ZAmbito, nombreProc: string): NFuncion | undefined {
  return buscarEnCadenaAmbito<NFuncion>(
      ambito,
      a => a.buscarNFuncion(nombreProc),
  );
}


export function codigoInvocar(ambito: ZAmbito, nombreFuncion: string, codigosArgumentos: Codigo[]): Codigo {

  const tiposArgumento = codigosArgumentos.map(c => c.tipo);
  const nombreProc = generarNombreProc(nombreFuncion, tiposArgumento);
  const nFuncion = buscarNFuncion(ambito, nombreProc);

  if (nFuncion === undefined) {
    const nombreBonito = `${nombreFuncion}(${tiposArgumento.map(t => t.nombre).join(", ")})`;
    throw new SemanticError(`Funcion ${nombreBonito} no declarado`);
  }

  const codigo = new Codigo();
  codigo.tipo = nFuncion.tipoRetorno;
  codigo.extra = `${nombreFuncion}(${codigosArgumentos.map(c => c.extra).join(", ")})`;

  codigo.agregarCodigos(codigosArgumentos);
  // se marcan los apuntadores de los argumentos como utilizados
  codigosArgumentos.forEach(c => {
    GestorTemp.usarTemporal(c.apuntador);
  });

  console.log('Temporales no usados:', GestorTemp.cantidad);
  console.log(GestorTemp.temporales);

  const temporalesNoUtilizados = GestorTemp.cantidad;

  // Backup de temporales no utilizados
  for (let i = 0; i < temporalesNoUtilizados; i++)
  {
    const temporal = generarTemporal();
    codigo.agregar(`${temporal} = P + ${obtenerEspacioOcupadoEnFuncion(ambito) + i};`, false);
    codigo.comentar(`& Backup ${GestorTemp.temporales[i]}`);
    codigo.agregar(`stack[${temporal}] = ${GestorTemp.temporales[i]};`, false);
    codigo.comentar(`Backup ${GestorTemp.temporales[i]}`);
  }

  codigo.agregar(`P = P + ${obtenerEspacioOcupadoEnFuncion(ambito) + temporalesNoUtilizados};`)
  codigo.comentar(`Cambio de ambito`);

  // paso de parametros
  codigosArgumentos.forEach((codigoArgumento, indice) => {
    const codigoDestino = codigoObtenerVar(nFuncion.ambito, nFuncion.nombresParametro[indice])
    const codigoAsignacion = codigoAsignar(codigoDestino, codigoArgumento, true);
    codigo.agregarCodigo(codigoAsignacion);
    codigo.comentar(` (argumento)`);
  });

  // invocacion
  codigo.agregar(`call ${nombreProc}`);
  codigo.comentar(`call ${nombreProc}`);

  // captura de retorno
  if (nFuncion.tipoRetorno !== nTipoVoid)
  {
    const codigoRetorno = desenvolver(codigoObtenerVar(nFuncion.ambito, NFuncion.RETURN));
    codigo.agregarCodigo(codigoRetorno);
    codigo.apuntador = codigoRetorno.apuntador;
  }

  // restauracion de ambito
  codigo.agregar(`P = P - ${obtenerEspacioOcupadoEnFuncion(ambito) + temporalesNoUtilizados};`)
  codigo.comentar(`Ambito restaurado`);

  // recupero temporales
  // Backup de temporales no utilizados
  for (let i = 0; i < temporalesNoUtilizados; i++)
  {
    codigo.agregar(`${GestorTemp.temporales[i]} = P + ${obtenerEspacioOcupadoEnFuncion(ambito) + i};`);
    codigo.comentar(`& Backup ${GestorTemp.temporales[i]}`);
    codigo.agregar(`${GestorTemp.temporales[i]} = stack[${GestorTemp.temporales[i]}];`);
    codigo.comentar(`${GestorTemp.temporales[i]} = Backup ${GestorTemp.temporales[i]}`);
  }

  return codigo;
}
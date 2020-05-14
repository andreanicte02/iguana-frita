import {Codigo, GestorTemp} from "../nodes/Codigo.js";
import {SemanticError} from "./SemanticError.js";
import {NTipo, NTipoArreglo, NTipoVar} from "./NTipo.js";
import {ZAmbito} from "./ZAmbito.js";
import {
  desenvolver, generarNombreConstructor,
  generarNombreProc,
  generarTemporal,
  obtenerEspacioOcupadoEnFuncion,
  obtenerEspacioOcupadoEnFuncionExclusivo,
  obtenerTipoDesdeBancoArray
} from "../Utilidades.js";
import {NFuncion} from "./NFuncion.js";
import {
  nTipoBooleanConEtiqueta,
  nTipoBooleanNormal,
  nTipoChar,
  nTipoEntero,
  nTipoNull,
  nTipoVoid
} from "./TiposPrimitivos";
import {deBooleanoEtiquetaANormalCondicional, esPrimitivo, esTipoPrimitivo} from "../nodes/TypeDefinition";
import {codigoCrearEntero} from "../nodes/NodoCrearInteger.js";
import {codigoCrearChar} from "../nodes/NodoCrearChar.js";


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
  codigo.acceso = `heap[${tupla.indice + 1}]`;
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
export function codigoObtenerPropiedad(codigoOrigen: Codigo, nombreAtributo: string, exclusivo = false): Codigo {

  if (codigoOrigen.tipo.ambito === undefined) throw new Error('ambito de tipo no fue inicializado');
  const tupla = codigoOrigen.tipo.ambito.buscarPropiedadConDireccionRelativa(nombreAtributo);

  if (tupla === undefined) throw new SemanticError(`Atributo ${nombreAtributo} no esta definido en instancias de tipo ${codigoOrigen.tipo.nombre}`);

  const codigoHeap = codigoObtenerVarDeHeapConTuplaExclusivo(nombreAtributo, codigoOrigen.apuntador, tupla);

  const codigo = new Codigo();
  if (!exclusivo) {
    codigo.agregarCodigo(codigoOrigen);
  }
  codigo.agregarCodigo(codigoHeap);

  codigo.tipo = codigoHeap.tipo;
  codigo.apuntador = codigoHeap.apuntador;
  codigo.acceso = codigoHeap.acceso;
  codigo.extra = `${codigoOrigen.extra}.${codigoHeap.extra}`;
  return codigo;
}

export function codigoObtenerVar(ambito: ZAmbito, nombre: string): Codigo {

  let esGlobal = false;
  let encontradoEn: ZAmbito | undefined;

  const tupla = buscarEnCadenaAmbito<{indice: number; nTipoVar: NTipoVar}>(
      ambito,
          a => {
            encontradoEn = a;
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

  const espacio = obtenerEspacioOcupadoEnFuncionExclusivo(encontradoEn!);
  tupla.indice += espacio;
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
  clean = false,
): Codigo {

  const codigoValorAux = (exclusivo || codigoValor.tipo === nTipoBooleanNormal)
      ? codigoValor: deBooleanoEtiquetaANormalCondicional(codigoValor);

  if (!(codigoDestino.tipo instanceof NTipoVar))
    throw new SemanticError(
      `Lado izquierdo de asignacion no es una variable: ${codigoDestino.tipo.nombre}`
    );
  const variableTipo = codigoDestino.tipo.tipoContenido;
  if (variableTipo !== codigoValorAux.tipo && !clean)
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



/**
 * Verifica si dos tipos son compatibles
 * @param tipoA viene de NFUncion
 * @param tipoB viene de un argumento
 */
function tiposCompatibles(tipoA: NTipo, tipoB: NTipo): boolean {
  if (tipoB === nTipoNull) {
    return !esTipoPrimitivo(tipoA);
  }

  return tipoA === tipoB;
}

function tiposCompatibleConFuncion(nFuncion: NFuncion, tipos: NTipo[]): boolean {
  const functionTipos = nFuncion.parametrosTipos;
  if (functionTipos.length !== tipos.length) {
    return false;
  }
  return functionTipos.every((ft, indice) => tiposCompatibles(ft, tipos[indice]));
}

function buscarNFuncion(ambito: ZAmbito, nombreProc: string, tipos: NTipo[]): NFuncion | undefined {

  const nombreSinTipos  = nombreProc.split('_', 2).join('_');

  const entradas = buscarEnCadenaAmbito<[string, NFuncion][]>(
      ambito,
      a => a.obtenerNFuncionesEntradas(),
  );
  if (entradas === undefined) return undefined;

  const entradasConCasiMismoNombre = entradas.filter(([nombre, ]) => nombre.startsWith(nombreSinTipos));

  return entradasConCasiMismoNombre
      .map(([, nFuncion]) => nFuncion)
      .find(nFuncion => tiposCompatibleConFuncion(nFuncion, tipos));
}


export function codigoInvocar(ambito: ZAmbito, nombreFuncion: string, codigosArgumentos: Codigo[], esConstructor = false, especial = false): Codigo {

  const tiposArgumento = codigosArgumentos.map(c => c.tipo);
  const nombreProc = esConstructor? nombreFuncion: generarNombreProc(nombreFuncion, tiposArgumento, especial);
  const nFuncion = buscarNFuncion(ambito, nombreProc, tiposArgumento);

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

  // console.log('Temporales no usados:', GestorTemp.cantidad);
  // console.log(GestorTemp.temporales);

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
  codigo.agregar(`call ${nombreProc};`);
  codigo.comentar(`call ${nombreProc};`);

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
    codigo.agregar(`${GestorTemp.temporales[i]} = P + ${obtenerEspacioOcupadoEnFuncion(ambito) + i};`, false);
    codigo.comentar(`& Backup ${GestorTemp.temporales[i]}`);
    codigo.agregar(`${GestorTemp.temporales[i]} = stack[${GestorTemp.temporales[i]}];`, false);
    codigo.comentar(`${GestorTemp.temporales[i]} = Backup ${GestorTemp.temporales[i]}`);
  }

  // console.log('Fin de Temporales no usados:', GestorTemp.cantidad);
  // console.log(GestorTemp.temporales);

  return codigo;
}

export function codigoCrearArray(tipoContenido: NTipo, codigoValor: Codigo, codigos: Codigo[]): Codigo {

  if (codigoValor.tipo !== nTipoEntero)
  {
    throw new SemanticError(`Solo se puede reservar una cantidad entera de memoria`);
  }

  const codigo = new Codigo();
  codigo.tipo = obtenerTipoDesdeBancoArray(tipoContenido);

  codigo.apuntador = generarTemporal();
  codigo.agregarCodigos(codigos);
  codigo.agregarCodigo(codigoValor);

  codigo.agregar(`${codigo.apuntador} = H;`);
  codigo.comentar(`captura de direccion`);

  const temp = generarTemporal();
  codigo.agregar(`${temp} = ${codigoValor.apuntador} + 1;`);
  codigo.comentar(`array.legth espacio`);

  codigo.agregar(`H = H + ${temp}; `);
  codigo.comentar(`(${codigoValor.extra}) bloques reservados`);

  codigo.agregar(`heap[${codigo.apuntador}] = ${codigoValor.apuntador};`);
  codigo.comentar(`se popula la propiedad length`);

  codigo.extra = `[new ${tipoContenido.nombre}(${codigoValor.extra}) ]`;

  if (codigos.length) {
    codigo.agregar(`${temp} = ${codigo.apuntador};`);
    codigo.comentar(`temporal para asignar valores`)
  }

  codigos.forEach((c, index) => {
    codigo.agregar(`${temp} = ${temp} + 1;`)
    codigo.agregar(`heap[${temp}] = ${c.apuntador};`);
    codigo.comentar(`[${index}] = ${c.extra}`);
  });

  return codigo;
}

export function codigoCrearArrayConValores(codigos: Codigo[]): Codigo {

  if (codigos.length === 0)
    throw new SemanticError(`No se puede crear un arreglo sin ningun valor`);

  const tipos = codigos.map(c => c.tipo);

  const tipoContenido = tipos
      .find(t => t !== nTipoNull);

  if (tipoContenido === undefined)
    throw new SemanticError(`al menos un elemento del arreglo tiene que ser diferente de nulo`);

  // se tiene un tipo valido, que puede ser primitivo o no
  if (esTipoPrimitivo(tipoContenido)) {
    const todosMismoTipo = tipos.every(t => t === tipoContenido);
    if (!todosMismoTipo) throw new SemanticError(`Todos los elementos del array deben de ser de tipo '${tipoContenido.nombre}'`);
  }
  else {
    const todosTiposCompatibles = tipos.every(t => t === tipoContenido || t === nTipoNull);
    if (!todosTiposCompatibles) throw new SemanticError(`Los elementos del array deben de ser de tipo '${tipoContenido.nombre}'`);
  }

  return codigoCrearArray(tipoContenido, codigoCrearEntero(codigos.length), codigos);
}

function esNumerico(tipo: NTipo): boolean {
  return tipo === nTipoEntero || tipo === nTipoChar;
}

export function codigoAccessoIndice(codigoArreglo: Codigo, codigoIndice: Codigo): Codigo {

  if (!(codigoArreglo.tipo instanceof NTipoArreglo)) {
    throw new SemanticError("Operador [] solo valido con arrays, no valido para " + codigoArreglo.tipo.nombre);
  }

  if (!esNumerico(codigoIndice.tipo))
  {
    throw new SemanticError("Debe de ser un indice entero, no valido para " + codigoIndice.tipo.nombre);
  }

  const codigo = new Codigo();
  codigo.tipo = new NTipoVar(codigoArreglo.tipo.tipoContenido);
  codigo.extra = `${codigoArreglo.extra}[${codigoIndice.extra}]`;

  codigo.agregarCodigo(codigoArreglo);
  codigo.agregarCodigo(codigoIndice);

  const temp = generarTemporal();
  codigo.agregar(`${temp} = ${codigoArreglo.apuntador} + 1;`);
  codigo.comentar("bloque length");
  codigo.apuntador = generarTemporal();
  codigo.agregar(`${codigo.apuntador} = ${temp} + ${codigoIndice.apuntador};`);

  codigo.comentar(`&${codigoArreglo.extra}[${codigoIndice.extra}]`);
  codigo.acceso = `heap[${codigo.apuntador}]`;

  return codigo;
}

export function codigoObtenerInstanciaVacia(tipo: NTipo): Codigo {
  if (tipo.ambito === undefined) throw new Error(`ambito de tipo no inicializado`);
  const codigo = new Codigo();
  codigo.tipo = tipo;
  codigo.apuntador = generarTemporal();
  codigo.agregar(`${codigo.apuntador} = H;`);
  codigo.comentar("captura de direccion");
  codigo.agregar(`H = H + ${tipo.ambito.espacioEnMemoria};`);
  codigo.comentar(`(new ${tipo.nombre})`);
  codigo.extra = `new ${tipo.nombre}`;
  return codigo;
}

export function codigoCrearString(ambito: ZAmbito, texto: string): Codigo {

  const tipoString = buscarEnCadenaAmbito<NTipo>(ambito, a => a.buscarTipo('string'));
  if (tipoString === undefined) throw new Error(`No has declarado el tipo String`);

  const codigoIstanciaString = codigoObtenerInstanciaVacia(tipoString);

  // se asigna el vector de chars a la propiedad `chars` de la instancia String
  const codigosChar = [...texto].map(c => codigoCrearChar(c));
  const codigoArregloChars = codigoCrearArrayConValores(codigosChar);
  const codigoPropiedadChars = codigoObtenerPropiedad(codigoIstanciaString, 'chars', true);
  const codigoAsignarPropiedad = codigoAsignar(codigoPropiedadChars, codigoArregloChars);

  const codigo = new Codigo();
  codigo.agregarCodigo(codigoIstanciaString);
  codigo.agregarCodigo(codigoAsignarPropiedad);

  codigo.tipo = codigoIstanciaString.tipo;
  codigo.apuntador = codigoIstanciaString.apuntador;
  codigo.extra = JSON.stringify(texto);

  return codigo;

}








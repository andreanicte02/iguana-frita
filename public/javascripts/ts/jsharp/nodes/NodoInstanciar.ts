import {NodoAst, NodoAstPro} from "./NodoAst.js";
import {ZAmbito} from "../types/ZAmbito.js";
import {Codigo} from "./Codigo.js";
import {FileLocation} from "./FileLocation.js";
import { generarTemporal } from "../Utilidades.js";
import {NTipo} from "../types/NTipo.js";
import {codigoInvocar} from "../types/codigos.js";


function codigoObtenerInstanciaVacia(tipo: NTipo): Codigo {
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

export class NodoInstanciar extends NodoAstPro {
    private nodoTipo: NodoAst;

    constructor(fileLocation: FileLocation, nodoTipo: NodoAst) {
        super(fileLocation);
        this.nodoTipo = nodoTipo;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const codigoTipo = this.nodoTipo.generarCodigo(ambito);

        const codigoInstanciaVacia = codigoObtenerInstanciaVacia(codigoTipo.tipo);
        const codigoInvocarConstructor = codigoInvocar(ambito, codigoTipo.tipo.nombre, [codigoInstanciaVacia], true);

        const codigo = new Codigo();
        codigo.agregarCodigo(codigoInvocarConstructor);

        codigo.tipo = codigoInstanciaVacia.tipo;
        codigo.apuntador = codigoInstanciaVacia.apuntador;
        codigo.extra = codigoInstanciaVacia.extra;

        return codigo;
    }
}
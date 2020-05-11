import {NodoAst, NodoAstPro} from "./NodoAst.js";
import {ZAmbito} from "../types/ZAmbito.js";
import {Codigo} from "./Codigo.js";
import {FileLocation} from "./FileLocation.js";
import {generarNombreConstructor, generarTemporal} from "../Utilidades.js";
import {NTipo} from "../types/NTipo.js";
import {codigoInvocar, codigoObtenerInstanciaVacia} from "../types/codigos.js";



export class NodoInstanciar extends NodoAstPro {
    private nodoTipo: NodoAst;

    constructor(fileLocation: FileLocation, nodoTipo: NodoAst) {
        super(fileLocation);
        this.nodoTipo = nodoTipo;
    }

    generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

        const codigoTipo = this.nodoTipo.generarCodigo(ambito);

        const codigoInstanciaVacia = codigoObtenerInstanciaVacia(codigoTipo.tipo);
        const nombreConstructor = generarNombreConstructor(codigoTipo.tipo);
        const codigoInvocarConstructor = codigoInvocar(ambito, nombreConstructor, [codigoInstanciaVacia], true);
        const codigo = new Codigo();
        codigo.agregarCodigo(codigoInvocarConstructor);

        codigo.tipo = codigoInstanciaVacia.tipo;
        codigo.apuntador = codigoInstanciaVacia.apuntador;
        codigo.extra = codigoInstanciaVacia.extra;

        return codigo;
    }
}
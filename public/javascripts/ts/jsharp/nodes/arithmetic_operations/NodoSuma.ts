import { FileLocation } from "../FileLocation.js";
import { NodoAst, NodoAstPro } from "../NodoAst.js";
import { Codigo } from "../Codigo.js";
import { desenvolver, generarTemporal } from "../../Utilidades.js";
import { ZAmbito } from "../../types/ZAmbito.js";
import {deBooleanoEtiquetaANormal, esNumero, obtenerTipoOperacionAritmeticaSuma} from "../TypeDefinition";
import {SemanticError} from "../../types/SemanticError";
import {buscarEnCadenaAmbito, codigoInvocar} from "../../types/codigos";
import {NTipo} from "../../types/NTipo";
import {nTipoBooleanConEtiqueta} from "../../types/TiposPrimitivos";


export class NodoSuma extends NodoAstPro {

  public readonly e1: NodoAst;
  public readonly e2: NodoAst;
  private readonly symbol: string;

  constructor(fileLocation: FileLocation, e1: NodoAst, e2: NodoAst) {
    super(fileLocation);
    this.e1 = e1;
    this.e2 = e2;
    this.symbol = "+";
  }

  generacionSeguraDeCodigo(ambito: ZAmbito): Codigo {

    const c1 = desenvolver(this.e1.generarCodigo(ambito));
    const c2 = desenvolver(this.e2.generarCodigo(ambito));

    const aux1 = c1.tipo === nTipoBooleanConEtiqueta ?deBooleanoEtiquetaANormal(c1): c1;
    const aux2 = c2.tipo === nTipoBooleanConEtiqueta ?deBooleanoEtiquetaANormal(c2): c2;

    const tipo = obtenerTipoOperacionAritmeticaSuma(aux1, aux2, ambito);
    
    if(tipo === undefined){

      throw new SemanticError(`Error de tipos operacion ${c1.tipo.nombre} ${this.symbol} ${c2.tipo.nombre} `);
    }

    const codigo = new Codigo();
    codigo.tipo = tipo;

    if(esNumero(codigo)){

      codigo.agregarCodigo(aux1);
      codigo.agregarCodigo(aux2);
      codigo.apuntador = generarTemporal();
      codigo.agregar(`${codigo.apuntador} = ${aux1.apuntador} ${this.symbol} ${aux2.apuntador};`);
      codigo.comentar(`${aux1.extra} ${this.symbol} ${aux2.extra}`);
      codigo.extra = `${aux1.extra} ${this.symbol} ${aux2.extra}`;
      return codigo;

    }else{


      const codigoFuncion = codigoInvocar(ambito,'concatenar',[aux1, aux2],false, true);
      codigo.agregarCodigo(codigoFuncion);
      codigo.apuntador = codigoFuncion.apuntador;
      return codigo;

    }


  }

}





import { FileLocation } from "../FileLocation.js";
import { NodoAst, NodoAstPro } from "../NodoAst.js";
import { Codigo } from "../Codigo.js";
import { desenvolver, generarTemporal } from "../../Utilidades.js";
import { ZAmbito } from "../../types/ZAmbito.js";
import {BinaryOperations} from "../BinaryOperations";

export class NodoSuma extends BinaryOperations {

  constructor(fileLocation: FileLocation, e1: NodoAst, e2: NodoAst) {
    super(fileLocation, e1, e2, "+");

  }
}

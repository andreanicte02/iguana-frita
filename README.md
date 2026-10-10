# J# → Código de tres direcciones

Compilador del lenguaje **J#** (parecido a Java) hecho para el curso de Organización de Lenguajes y Compiladores 2.
Traduce el código fuente a **código de tres direcciones (3D)** y trae un intérprete de 3D para ejecutarlo,
todo en el navegador.

**Demo:** https://andreanicte02.github.io/iguana-frita/

- Analizador léxico/sintáctico con [Jison](https://github.com/zaach/jison) (`public/javascripts/parser/parser.jison`)
- AST y generación de 3D en TypeScript (`public/javascripts/ts/jsharp/`)
- Intérprete y optimizador del 3D (`public/javascripts/3d/`, `public/javascripts/optmizar/`)
- Editor [Ace](https://ace.c9.io/), reportes de tabla de símbolos y de funciones

## Cómo se usa

1. Doble clic en un ejemplo del panel izquierdo.
2. **Compilar 3d**: genera el código 3D en el editor de la derecha.
3. **Ejecutar 3d**: corre el 3D y muestra la salida en la consola de abajo.

También se pueden cargar archivos propios con **Cargar archivos** (solo quedan en memoria del navegador;
**Descargar** baja el archivo abierto).

## Ejemplos

Están en `public/ejemplos/`. Todos importan `api.j`, que define `String` y las funciones `print()`.

| Archivo | Qué muestra |
|---|---|
| `estructuras/lista.j` | Lista simple enlazada |
| `estructuras/arbol-binario.j` | Árbol binario: inserción, búsqueda, recorrido |
| `estructuras/abb.j` | Árbol binario de búsqueda |
| `estructuras/avl.j` | Árbol AVL con rotaciones, imprime el árbol en formato Graphviz |
| `basicos/quicksort.j` | Arreglos y Quicksort |
| `basicos/structs.j` | Structs anidados y arreglos de structs |
| `basicos/strings.j` | Funciones nativas de String |
| `basicos/variables.j` | `var`, `const`, `global` y casteos |
| `errores/declaracion-duplicada.j` | Error semántico a propósito, para ver la tabla de errores |

Para agregar un ejemplo basta con ponerlo en `public/ejemplos/<carpeta>/` (el índice se genera en el build).

## Desarrollo

```bash
npm install
npm start      # compila el parser y el TypeScript, y abre la página en http://localhost:8080
npm run build  # solo compila
```

`npm run build` genera `parser.js` (Jison), `language.js` (Rollup + TypeScript) y `ejemplos/index.json`.
Al hacer push a `master`, el workflow `.github/workflows/pages.yml` compila y publica `public/` en GitHub Pages.

## Notas del proyecto

### Orden de analisis en bloque

+ Declaracion de Estructuras (no se analiza lo interior)
+ Declaracion de Funcion (solo firma)
+ Se genera el codigo "constructor" de cada estructura
+ se genera el codigo de cada funcion en el ambito
+ se genera el codigo para las variables globales

### Git
https://docs.google.com/document/d/1pGWOrVRGFv5ElYKtYodffLzUX-UYMlfZ4vG-8IIM08c/edit?usp=sharing

### Booleanos

https://docs.google.com/document/d/1V70JDf1lCCd1W1t-szvOb3Al7jXiKrmPL8u1kiFura0/edit?usp=sharing

### Pendientes
[/] TipoChar
[/] Manejo de Import
Declaracion de variables pag 13
[] Declaracion tipo 2
[] Declaracion tipo 3
[] Declaracion Tipo 4
Operaciones
[/] Operaciones arimeticas con el tipo Char
[/] Operaciones arimeticas con cadenas
[/] Division
[/] Potencia
[/] Igualdad y Desigualdad
[/] Igualdad de referencias
Sentencias de control
[/] Sentencia Switch
[/] Break
[/] Continue
[/] Return
Casteos
[] casteos implicitos
[/] casteos explicitos
Funciones 
[] Llamada a funciones tipo 2
[/] invocacion '.' de funciones
[/] Funcion Print
Excepciones
[] Exepciones 
[] TryCatch
[] Throw

String
[/] Manejo de String
[/] toCharArray
[/] length
[/] toUpeerCase
[/] toLowerCase()
[/] charAt()

Arreglos
[/] Arreglos
[/] Inicializacion especial
[/] AccesoArreglos
[/] length
[/] linealize

Estrucths
[/] Acceso Structs
[/] Size
[/] getReference
[/] InstanceOf

Reportes
[]Reportes tabla simbolos
[]Reporte errores
[]Reporte ast
[] Gramatica

3d
[]Probarlo con el interprete de los aux

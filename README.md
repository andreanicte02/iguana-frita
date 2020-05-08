
## Desarrollo

```bash
npm install -g browser-sync
```

Se tiene dos scripts npm, estos pueden ser ejecutados desde IntelliJ o con el comando `npm run <name>`
+ actualizar: compila el jison y el codigo typescript
+ monitorear: inicia el servidor web y enciende browser-sync para que refresque el navegador al detectar un cambio.
Se compone de dos comandos, y en la parte de browser-sync tiene que especificado que solo observe los cambios de los archivos compilados.

```bash
node ./bin/www & browser-sync start --proxy 'localhost:3000' --files 'public/javascripts/language.js' 'public/javascripts/parser/parser.js'
```

Recomiendo ejecutar al script `monitorear` desde una terminal externa a IntelliJ
```bash
npm run monitorear
```

## Orden de analisis en bloque

+ Declaracion de Estructuras (no se analiza lo interior)
+ Declaracion de Funcion (solo firma)
+ Se genera el codigo "constructor" de cada estructura
+ se genera el codigo de cada funcion en el ambito
+ se genera el codigo para las variables globales

## Git
https://docs.google.com/document/d/1pGWOrVRGFv5ElYKtYodffLzUX-UYMlfZ4vG-8IIM08c/edit?usp=sharing

## Booleanos

https://docs.google.com/document/d/1V70JDf1lCCd1W1t-szvOb3Al7jXiKrmPL8u1kiFura0/edit?usp=sharing

## Pendientes
[ ] TipoChar
[ ] Manejo de Import
Declaracion de variables pag 13
[] Declaracion tipo 2
[] Declaracion tipo 3
[] Declaracion Tipo 4
Operaciones
[] Operaciones arimeticas con el tipo Char
[] Operaciones arimeticas con cadenas
[] Division
[] Potencia
[] Igualdad y Desigualdad
[] Igualdad de referencias
Sentencias de control
[] Sentencia Switch
[] Break
[] Continue
[] Return
Casteos
[] casteos implicitos
[] casteos explicitos
Funciones 
[] Llamada a funciones tipo 2
[] invocacion '.' de funciones
[] Funcion Print
Excepciones
[] Exepciones 
[] TryCatch
[] Throw

String
[] Manejo de String
[] toCharArray
[] length
[] toUpeerCase
[] toLowerCase()
[] charAt()

Arreglos
[] Arreglos
[] AccesoArreglos
[] length
[] linealize

Estrucths
[/] Acceso Structs
[] Size
[] getReference
[] InstanceOf

Reportes
[]Reportes tabla simbolos
[]Reporte errores
[]Reporte ast
[] Gramatica

3d
[]Probarlo con el interprete de los aux

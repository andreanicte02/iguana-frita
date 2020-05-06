
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
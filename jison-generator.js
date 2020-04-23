var fs = require("fs");
const execSync = require('child_process').execSync;

const DIR = "./public/javascripts/parser/";
//nombre del archivo
//salida del archivo
const JISON_FILE = "parser.jison";
const OUT_FILE = "parser.js";


try {
    console.log("delete previous js");
    if (fs.existsSync(`${DIR}${OUT_FILE}`)) {
        fs.unlinkSync(`${DIR}${OUT_FILE}`);
    }
    console.log("[/] deleted js")

    // se ejecuta jison
    console.log("generate js parser...");
    const jisonCommand = `jison ${DIR}${JISON_FILE} -o ${DIR}${OUT_FILE}`;
    console.log(jisonCommand);
    execSync(jisonCommand, {stdio: 'inherit'});
    console.log("[/] parser parser");



    console.log(`[/]  ${JISON_FILE}.js generated`);
} catch (err) {
    console.log(err);
}

function optimizar(){
    txt = `//optimizacion00 64\n${editor3d.getValue()}`;
    txt = regla8(txt);
    txt = regla9(txt);
    txt = regla10(txt);
    txt = regla11(txt);
    txt = regla12(txt);
    txt = regla13(txt);
    txt = regla14(txt);
    txt = regla15(txt);

    editor3d.setValue(txt);


}

function regla8(txt) {
    return parseChafa("+",txt);
}

function regla9(txt) {

   return  parseChafa("-",txt);
}

function regla10(txt) {
    return parseChafa("*",txt);
}

function regla11(txt) {
    return parseChafa("/",txt);
}

function parseChafa(sign, text) {
    let dividido = text.split('\n');
    //debugger;
    let salida = ''
    dividido.forEach(value=>{
        linea = value.split(' ');
        if(linea.length >= 5 ){

            if(linea[3]===sign){
                salida+=comparar(linea[0], linea[2], linea[4], linea,sign)

            }else{
                salida += linea.join(" ");
            }

        }else
        {
            salida += linea.join(" ");
        }
        salida+= '\n';
    });
    //debugger;


    return salida;

}

function comparar(e1, e2, e3, linea, sign) {
    //debugger;
    if(e3.replace(";","")=== "0" && (sign === '+' || sign === '-')){

        if(e1 === e2){
            return `//se aplico regla 8-9 se elimino ${e1} = ${e2} ${sign} 0;`
        }
    }else if(e3.replace(";","")=== "1" && (sign === '*' || sign === '/')){

        if(e1 === e2){
            return `//se aplico regla 10-11 se elimino ${e1} = ${e2} ${sign} 1;`
        }
    }else if(e3.replace(";","")==="2" && (sign === '*')){
        aux =  `//se aplico regla 16 se cambio ${e1} = ${sign} ${e2}; regla 16\n`
        aux += `${e1} = ${e2} + ${e2};`

    }else if(e3.replace(";","")==="0" && (sign === '*')){
        aux =  `//se aplico regla 16 se cambio ${e1} = ${sign} ${e2}; regla 17\n`
        aux += `${e1} = 0;`

    }else if(e2==="0" && (sign === '/')){
        aux =  `//se aplico regla 16 se cambio ${e1} = ${sign} ${e2}; regla 17\n`
        aux += `${e1} = 0;`
    }

    return  linea.join(" ");

}

function regla12(txt) {

    return  txt.split("+ 0;").join("; //se aplico la regla 12 se elimino + 0");

}

function regla13(txt) {

    return  txt.split("- 0;").join("; //se aplico la regla 12 se elimino - 0");

}


function regla14(txt) {

    return   txt.split("* 1;").join("; //se aplico la regla 12 se elimino * 1");

}


function regla15(txt) {

    return   txt.split("/ 1;").join("; //se aplico la regla 12 se elimino / 1");

}





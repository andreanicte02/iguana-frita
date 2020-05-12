

define String as [
    char[] chars
    ];


@integer size(String texto) {
    return texto.chars.length;
}

void println(String texto){
    #print(c, '>');
    #print(c, ' ');
    for(integer i = 0; i < texto.chars.length; i = i + 1){
        #print(c, texto.chars[i]);
    }
    #print(c, '\n');
}


void comida() {
    
    String comida = "pozole";
    println(comida);
    println(comida.size());
    
    integer[] numeros = {1, 3, 4, 1993};
    
    println(numeros[3]);
    
    print('h');
    print('o');
    print('l');
    println('a');
}


define String as [
    char[] chars
    ];



void println(String texto){
    #print(c, '>');
    #print(c, ' ');
    for(integer i = 0; i < texto.chars.length; i = i + 1){
        #print(c, texto.chars[i]);
    }
    #print(c, '\n');
}


void comida() {
    
    
    integer[] numeros = {1, 3, 4, 1993};
    
    println(numeros[3]);
    
    print('h');
    print('o');
    print('l');
    println('a');
}
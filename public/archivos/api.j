

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

void println(double decimal){
    #print(c, '>');
    #print(c, ' ');
    #print(d, decimal);
    #print(c, '\n');
}

void println(integer entero){
    #print(c, '>');
    #print(c, ' ');
    #print(e, entero);
    #print(c, '\n');
}

void println(char caracter){

       #print(c, '>');
       #print(c, ' ');
       #print(c, caracter);
       #print(c, '\n');

}

void println(boolean bool){

    if(bool){
        println("true");
        return ;
    }

    println("false");

}


void print(double decimal){
    #print(d, decimal);
}


void print(integer entero){
    #print(e, entero);
}


void print(char caracter){
    #print(c, caracter);
}

//####potencia

integer potencia(integer a, integer n){
    integer result;

    if(n==0){
        result =1;
    }else{
        result = a * potencia(a, n-1);
    }
    return result;

}

//####strings

String concatenar(String s1, String s2){

    char [] cadena  =  strc char[s1.chars.length + s2.chars.length];

    integer x=0;
    for(integer i =0; i< s1.chars.length ; i = i+1){
        cadena[i]=s1.chars[i];
        x= x + 1;
    }

    for(integer i = 0; i< s2.chars.length ; i = i+1){

        cadena[x]= s2.chars[i];
        x = x + 1;
    }

    String result = strc String();
    result.chars = cadena;
    return result;

}

String concatenar(String s1, boolean s2){

    return concatenar(s1, __boolToString(s2));

}

String concatenar(boolean s1, String s2){

    return concatenar(__boolToString(s1), s2);

}


String __boolToString(boolean b){

    if(b){
        return "true";
    }

    return "false";

}

String __intToString(integer num){

    boolean a;

    a= num > 0;



    return "asdf";
}

//###########
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
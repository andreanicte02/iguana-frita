

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

@String concatenar(String s1, String s2){

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

@String concatenar(String s1, boolean s2){

    return @concatenar(s1, @__boolToString(s2));

}

@String concatenar(boolean s1, String s2){

    return @concatenar(@__boolToString(s1), s2);

}

@String concatenar(integer i1, String s2){

    return @concatenar(@__intToString(i1), s2);

}

@String concatenar(String s1, integer i2){

    return @concatenar(s1, @__intToString(i2));

}

@String concatenar(double d1, String s2){

    return @concatenar(@__doubleToString(d1), s2);

}

@String concatenar(String s1, double d2){

    return @concatenar(s1, @__doubleToString(d2));

}

@String concatenar(char c1, String s2){

    return @concatenar(@__charToString(c1), s2);

}


@String concatenar(String s1, char c2){

    return @concatenar(s1, @__charToString(c2));

}

@String concatenar(char c1, char c2){

    return @concatenar(@__charToString(c1), @__charToString(c2));

}


@String __boolToString(boolean b){

    if(b){
        return "true";
    }

    return "false";

}

@String __intToString(integer num){

    if(num == 0){
        return "0";
    }

    boolean esNegativo = num < 0;
    integer copiaNumero;

    if(esNegativo){
        copiaNumero = num * -1;
    }else{
        copiaNumero = num;
    }

    integer size = 0;

    while(copiaNumero> 0){
        copiaNumero = (integer) (copiaNumero/10);
        size = size +1;
    }

    if(esNegativo){
        size = size + 1;
        copiaNumero = num * -1;
    }else{
        copiaNumero = num;
    }

    char [] cadena = strc char[size];

    if(esNegativo){
        cadena[0]  = '-';
    }

    while(copiaNumero> 0){

        size = size - 1;
        //cambio
        cadena[size] = (char) ((copiaNumero % 10)+48);
        copiaNumero = (integer) (copiaNumero/10);

    }

    String cadenaFinal = strc String();
    cadenaFinal.chars = cadena;
    return cadenaFinal;
}

@String __doubleToString(double num){

    boolean esNegativo = num < 0 ;

    integer entero = (integer) num;
    integer decimal = (integer) ((num-entero)*100);

    if(esNegativo){

        decimal = decimal * -1;

    }

    return @concatenar(@__intToString(entero), @concatenar(".", decimal));

}

@String __charToString(char charmander){
    String cadena = strc String();
    char [] charizard = {charmander};

    cadena.chars = charizard;
    return cadena;
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
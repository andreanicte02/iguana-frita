
integer w, v = 4;

void print(integer entero){
    #print(e, entero);
}
void println(integer entero){
    #print(c, '>');
    #print(c, ' ');
    #print(e, entero);
    #print(c, '\n');
}

void print(char caracter){
    #print(c, caracter);
}

void println(char caracter){

       #print(c, '>');
       #print(c, ' ');
       #print(c, caracter);
       #print(c, '\n');
}


void principal() {

    integer[] panza = strc integer[9];
    panza[0] = 2001;
    panza[1] = 2002;
    
    println(panza[1]);
    println(panza.length);

    sent_control();
}

void sent_control(){
    for(integer x = 0; x< 5; x = x + 1 ){
        println(x);
         for(integer y= 0; y < 5; y = y+1){

                    println(y+100);

                    if(y>= 2){
                        break;
                    }
         }

         if(x>= 2){
            continue;
         }
    }
    
    integer b;
    
    println('w');
    
    while(b<5){
        
        println(b);
        
        b=b+1;
    }

    integer contador = 0;
    do{
       println(contador);
       contador = contador + 1;


    }while(contador<5)

    do{

        println('X');

        println('D');

    }while(4> 5  || 3> 6+12  || false)


    if(b>2 && false){

         println('1');

    }else if(false){

        println('2');

    }else if(true){

        println('3');

        if(false){

                 println('3');

            if(true){

                println('3');

            }

        }else{

            println('4');

            if(true){

                println('4');
                                 
            }else{
                println('4');
            }

        }

    }else{
        println('5');

        if(true){

            println('5');

        }

    }
    
}

define Vector as [
    integer x = 94,
    integer y = 93
    ];
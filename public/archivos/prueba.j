

import "api.j";

integer w, v = 4;

void principal() {
    
    String comida = "tamales";
    println(comida);
    
    comida();

    integer[] panza = strc integer[9];
    panza[0] = 2001;
    panza[1] = 2002;
    
    println(panza[1]);
    println(panza.length);


    println("factorial:");
    
    integer numero = factorial(5);
    println(factorial(5));
    println(potencia(2,3));
    println(@concatenar("concatenear ", "comida"));
    println(@concatenar(true, " comida"));
    double d = 2/3;
    boolean a = 5> 2;
    integer f = (integer) 2.1; 
    println(a);
    println(f);
    println(@concatenar("asdf",-1));
    println(@concatenar("--------------->df",20.14));
    println(@concatenar(-20.548465,"asd"));
    println(@concatenar('5',"asd"));
    println(@concatenar("asdfas", '-'));
    println(1+"asdf"+false+ 2.54 + 's');

}

integer factorial(integer num){
    
    if(num == 0){
        
        return 1 ;
        
    }else{
        
        return  num * factorial(num-1);

        
    }
    
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
       println('-');

       println('-');

    do{
       println(contador);
       contador = contador + 1;

        if(contador == 2 && true == (3>1) ){

             println('f');
             println('i');
             println('n');

            break;
        }

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


     return ; 

    println('S');

    println('W');
    println('I');

    println('T');

    switch (3*2-1) {
        case 3:
            println(3);
        case 5:
            println(2);
        case 7:
            println(5);
        default:
            println(8);
    }
    
   
}

define Vector as [
    integer x = 94,
    integer y = 93
    ];
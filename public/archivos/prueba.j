
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


void principal() {

    integer panza = 3;

    if (panza > 4) {
        println(1997);
    }
    else {
        println(1993);
    }

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
}

define Vector as [
    integer x = 94,
    integer y = 93
    ];


import "api.j";

integer w, v = 4;


void principal() {
    
    print("inicio");
    
    String uno = "hola";
    String dos = uno;
    String tres = uno.linealize();
    
    print(dos);
    print(tres);
    
    if (uno === dos) {
        print("misma referencia");
    }
    if (uno === tres) {
        print("misma referencia");
    }
    else {
        print("diferente referencia");
    }
    
    print("fin");

    
    
    print("asdf");
   
    Vector nulo;
    if(nulo == null){
        print("funciona");
    }else{
         print("nel");
    }
    integer a =0;
    print(a++);

}



define Vector as [
    integer x = 94,
    integer y = 93
    ];
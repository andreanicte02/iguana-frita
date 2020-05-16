

import "api.j";

integer w, v = 4;


void principal() {
    
    Vector v0 = strc Vector();
    Vector v1 = strc Vector();
    
    PRINT("SIZE");
    PRINT(v1.size());
    prINT("Reference:");
    print(v1.getReference());
    
    if (v1.instanceof(Vector)){
        print("v1 es instancia de Vector");
    }
    else {
        print("v1 no es instancia de vector");
    }
    
    if (v1.instanceof(String)){
        print("v1 es instancia de String");
    }
    else {
        print("v1 no es instancia de String");
    }
    
    
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
    integer y = 93,
    integer z = 24
    ];
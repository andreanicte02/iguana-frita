import "api.j";

void principal() {
    
  Lista lista = strc Lista();
  insertar(lista, 10);
  Nodo temp = lista.inicio;
  if(temp != null){
    print(1);
    temp = temp.sig;    
  }

  if(temp != null){
    print(2);
         
  }  
  
    
}

define Nodo as [
  integer dato,
  Nodo sig
];

define Lista as [
  Nodo inicio,
  integer tam
];


void insertar(Lista lista, integer dato) {
  Nodo nuevo = strc Nodo();
  nuevo.dato = dato;
  nuevo.sig = lista.inicio;
  lista.inicio = nuevo;
}

void imprimirLista(Lista lista) {
  Nodo temp = lista.inicio;
  while(temp != null) {
   
    temp = temp.sig;
  }
}
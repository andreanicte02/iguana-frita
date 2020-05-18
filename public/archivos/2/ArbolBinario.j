import "../api.j";
void principal()
{
	NodoB root = NodoB(10);
	add(root,5);
	add(root,15);
	add(root,8);
    add(root,2);
    add(root,45);
  	add(root,34);
  	add(root,9);
	
	NodoB encontrado = find(root,11);
	if ( encontrado != null ){
		print("Encontro el nodo de " + encontrado.value);
	} else {
		print("Valor no encontrado");
	}
	
	encontrado = find(root,8);
	if ( encontrado != null ){
		print("Encontro el nodo de " + encontrado.value);
	} else {
		print("Valor no encontrado");
	}
	
	print("Print in Order");
	printInOrder(root);
	print("Print pos Order");
	printPosOrder(root);
	print("Print pre order");
	printPreOrder(root);
	
}

// Nodo Binario de valores enteros
define NodoB as [
	integer value,
	NodoB left,
	NodoB right
];

/**
	Simulacion de un constructor NodoB
**/
NodoB NodoB(integer valor)
{
	NodoB root = strc NodoB();
	root.value = valor;
	return root;
}

void add(NodoB raiz,integer value)
{
	if ( value < raiz.value )
	{
		if ( raiz.left != null )
		{
			add(raiz.left,value);
		} else {
			raiz.left = NodoB(value);
		}
	} else {
		if ( raiz.right != null ){
			add(raiz.right,value);
		} else {
			raiz.right = NodoB(value);
		}
	}
}

NodoB find(NodoB raiz,integer value)
{
	if( value == raiz.value) {
		return raiz;
	} else if ( value < raiz.value){
		if ( raiz.left !=null ) {
			return find(raiz.left,value);
		} else {
			return null;
		}
	} else {
		if ( raiz.right != null ){
			return find(raiz.right,value);
		} else{
			return null;
		}
	}
}

void printInOrder(NodoB raiz){
	if ( raiz.left != null ) {
		printInOrder(raiz.left);
	}
	print(raiz.value);
	if ( raiz.right != null ){
		printInOrder(raiz.right);
	}
}

void printPreOrder(NodoB raiz)
{
	print(raiz.value);
	if ( raiz.left != null ){
		printPreOrder(raiz.left);
	}
	if ( raiz.right != null )
	{
		printPreOrder(raiz.right);
	}
}

void printPosOrder(NodoB raiz){
	if ( raiz.left != null ){
		printPosOrder(raiz.left);
	}
	if ( raiz.right != null ){
		printPosOrder(raiz.right);
	}
	print(raiz.value);
}
/* SALIDA:
Valor no encontrado
Encontro el nodo de 8
Print in Order
2
5
8
9
10
15
34
45
Print pos Order
2
9
8
5
34
45
15
10
Print pre order
10
5
2
8
9
15
45
34

*/

























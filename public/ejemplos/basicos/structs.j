// Estructuras (define ... as [...]) anidadas y arreglos de structs.
import "../api.j";
Define Profesor as [String nombre, Integer id];
Define Curso as [Integer codigo, String nombre, char seccion, double nota];
Define Estudiante as [String nombre = " ", Integer Edad, String carnet = "2015", Profesor profesor, Curso [] cursos];

void principal(){
	Estudiante e = nuevoEstudiante("Jefferson", 22, 04448);
	e.cursos = strc Curso[4];
	e.cursos[0] = nuevoCurso("compiladores 2", 0780, 'C', 85.01);
	e.cursos[1] = nuevoCurso("modela 2", 0970, 'A', 75.01);
	e.cursos[2] = nuevoCurso("gerenciales 2", 0980, 'B', 85.01);
	e.cursos[3] = nuevoCurso("Practicas Finales", 0740, 'A', 100.01);
	
	print("curso creado: "+e.cursos[0].nombre);
	e.profesor = nuevoProfesor("Luis Espino", 123);
	print(getInfo(e));

}

String getInfo(Estudiante e){
	String info = "---------  DATOS PERSONALES  ---------\nNombre: "+e.nombre+"\nEdad: "+e.edad+"\nCarnet: "+e.carnet+"\n";
	info = info + "---------  DATOS PROFESOR  ---------\nNombre: "+e.profesor.nombre+"\nId: "+e.profesor.id+"\n";
	info = info + "---------  DATOS CURSOS  ---------\n";
	
	for(Integer i = 0; i < e.cursos.length; i++){
		Curso c = getCursos(e)[i];
		if(c != null){
			info = info + (i+1)+") Nombre: "+c.nombre+"\nCódigo:"+c.codigo+"\nSección:"+c.seccion+"\nNota:"+c.nota+"\n";
		}else{
			info = info + (i+1)+") Nombre: --\nCódigo:--\nSección:--\nNota:--\n";
		}
		
	}
	
	return info;

}

Estudiante nuevoEstudiante(String nombre, Integer edad, Integer carnet){
	Estudiante e = strc Estudiante();
	e.nombre = nombre;
	e.edad = edad;
	e.carnet = e.carnet + carnet; //concatenacion de carnet 
	return e;
}

Curso nuevoCurso(String nombre, Integer codigo, char seccion, double nota ){
	Curso c = strc Curso();
	c.nombre = nombre;
	c.codigo = codigo;
	c.seccion = seccion;
	c.nota = nota;
	return c;
}

Profesor nuevoProfesor(String nombre, Integer id){
	Profesor p = strc Profesor();
	p.nombre = nombre;
	p.id = id;
	return p;
}


Curso [] getCursos(Estudiante e){
	
	return e.cursos;
}

/*

---------  DATOS PERSONALES  ---------
Nombre: Jefferson
Edad: 22
Carnet: 20154448
---------  DATOS PROFESOR  ---------
Nombre: Luis Espino
Id: 123
---------  DATOS CURSOS  ---------
1) Nombre: compiladores 2
Código:780
Sección:C
Nota:85.10000000000005112
2) Nombre: modela 2
Código:970
Sección:A
Nota:75.10000000000005112
3) Nombre: gerenciales 2
Código:980
Sección:B
Nota:85.10000000000005112
4) Nombre: Practicas Finales
Código:740
Sección:A
Nota:100.10000000000005112
*/
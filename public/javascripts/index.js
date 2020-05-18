/* eslint-disable */

// cambio reciente
// $("#errorsDiv").toggle();
$("#errorsButton").click(() => {
    $("#errorsDiv").toggle();
});

const errorsBody = $("#errorsBody");

function clearErrors() {
    errorsBody.empty();
}

$("#symbolsButton").click(function () {
    saveGod();
    window.open('/symbols');
});


function addErrorRow(tipo = "-", archivo = "-", linea = "-", columna= "-", mensaje = "-"){

    console.log("a agregar un error");

    const row = $("<tr></tr>");

    row.append(td(tipo));
    row.append(td(archivo));
    row.append(td(linea));
    row.append(td(columna));
    row.append(td(mensaje));

    errorsBody.append(row);

}
function td(text) {
    const _td = $("<td></td>");
    _td.text(text);
    return _td;
}


const INDENT = "&nbsp;&nbsp; &nbsp;&nbsp;";
// const INDENT = "  ";


( ()=>{
    const fileTreeRange = document.getElementById('file-tree-range');
    const fileTree = document.getElementById('file-tree');
    connectRangeDiv("java", fileTreeRange, fileTree);

    const editor3dRange = document.getElementById('editor-3d-range');
    const editor3d = document.getElementById('editor-3d');
    connectRangeDiv("3d", editor3dRange, editor3d, false);




    function connectRangeDiv(name, range, element, normal = true) {

        if (localStorage[name] !== undefined) {
            const intValue = JSON.parse(localStorage[name]);
            range.value = normal? intValue : range.max - intValue;
            setValue(element, intValue);
        }

        range.addEventListener('input', function () {
            const value = normal? this.value : this.max - this.value;

            setValue(element, value);

            localStorage[name] = value;
        });
    }

    function setValue(element, intValue) {
        element.style.width= intValue * 2 + 'px';
    }
})();




refreshFileTree();

function refreshFileTree() {
    const fileTreeDiv = $("#file-tree");
    fileTreeDiv.empty();
    $.getJSON("/get-files", function( data ) {
        paintDirectory(data, fileTreeDiv, "&nbsp;&nbsp;");

        // ESTO ABRE EL ULTIMO ARCHIVO ABIERTO
        ultimoArchivoPintando.dblclick();
    });
}


function paintDirectory(directory, contentDiv, indent){
    const directoryDiv = $("<div></div>", { "class" : "tree-element" });
    directoryDiv.append(indent);
    directoryDiv.append(document.createTextNode("* " + directory.name));

    directoryDiv.click(function () {
        $(".tree-element").removeClass("tree-element-active");
        directoryDiv.addClass("tree-element-active");
    });


    const childsDiv = $("<div></div>");

    if (directory.children){
        for (const child of directory.children){
            if (child.type === "directory") {
                paintDirectory(child, childsDiv, indent + INDENT);
            }
            else if (child.type === "file") {
                paintFile(child, childsDiv, indent + INDENT);
            }
        }
    }

    contentDiv.append(directoryDiv);
    contentDiv.append(childsDiv);
}

function paintFile(file, contentDiv, indent){
    const fileDiv = $("<div></div>", { "class" : "tree-element" });
    ultimoArchivoPintando = fileDiv;
    fileDiv.append(indent);
    fileDiv.append(document.createTextNode(file.name));
    
    fileDiv.click(function () {
        $(".tree-element").removeClass("tree-element-active");
        fileDiv.addClass("tree-element-active");
    });
    fileDiv.dblclick(function () {
        openFile(file);
    });

    contentDiv.append(fileDiv);
}


const editor3d = ace.edit("editor-3d");
editor3d.session.setMode("ace/mode/java");



const editor = ace.edit("tab-content");
editor.setReadOnly(true);



//editor-3d


const openFiles = [];
let currenOpenFile = null;


const executeButton = $("#executeButton");
executeButton.click(()=>{

    clearErrors();

    const text3d = editor3d.getValue();
    if (text3d.trim().length === 0) {
        alert("No hay nada que ejecutar");
    }
    else {

        try {
            const sentences = parser3d.parse(text3d);
            // ast3d.process(sentences);
            process3d(sentences);
        }
        catch (e) {
            if (e._semanticError){
                console.log(e._semanticError);
                alert(e.message);

                addErrorRow("Semantico", relativePath, e._p.first_line, e._p.first_column, e._semanticError.message);
            }
            else {
                console.log(e);
                alert(e.message);
                jj = e;

                if (e.hash) {
                    addErrorRow("Sintactico", relativePath, e.hash.line, 0, e.message);
                }
                else {
                    addErrorRow("?Sintactico", relativePath, 0, 0, e.message);
                }
            }

        }
    }
});






function process3d(sentences){
    myConsole.clear();

    z = new ast3d.ZContainer();
    const block  = new ast3d.Block3D(sentences);
    block.execute(z);

    while (z.blocks.length) {
        const lastBlock = z.blocks[z.blocks.length - 1];
        const sentence = lastBlock.step(z);
        if (sentence){
            // console.log(sentence.cutePos());
        }

    }
    myConsole.log("<< finalizado");
}


let arregloTS= undefined;
let arregloFunction= undefined;
let codigoFinal = undefined;
const compileButton = $("#compileButton");
compileButton.click(()=>{

    clearErrors();

    if (currenOpenFile === null) {
        console.log(".....")
        alert("No hay ningun archivo abierto...");
    }
    else {

        const jText = editor.getValue(); // or session.getValue

        parser.yy.paths = [];
        parser.yy.last = () => { return parser.yy.paths[parser.yy.paths.length - 1]; };
        const relativePath = getPublicPath(currenOpenFile.path);

        // const nodos = parser.parse(jText);
        // const texto = ast.generar3d(nodos);
        // editor3d.setValue(texto);
        // editor3d.clearSelection();

        try {
            const nodes = getSentencesWithLocation(relativePath, jText);
            const texto = ast.generar3d(nodes);

            arregloTS = ast.getTS();
            arregloFunction = ast.getFunctions();
            codigoFinal = texto;

            editor3d.setValue(texto);
            editor3d.clearSelection();
        }
        catch (e) {
            if (e._semanticError){
                console.log(e._semanticError);
                alert(e.message);

                addErrorRow("Semantico", relativePath, e._p.first_line, e._p.first_column, e._semanticError.message);
            }
            else {
                console.log(e);
                alert(e.message);
                jj = e;

                if (e.hash) {
                    addErrorRow("Sintactico", relativePath, e.hash.line, 0, e.message);
                }
                else {
                    addErrorRow("?Sintactico", relativePath, 0, 0, e.message);
                }
            }
        }



    }
});

function importNodes(currentFile, filePathToImport) {
    const lastIndex1 = currentFile.lastIndexOf('/');
    const lastIndex2 = currentFile.lastIndexOf('\\');
    const lastIndex = lastIndex1 < lastIndex2? lastIndex2: lastIndex1;
    const newFileRelativePath = currentFile.substring(0, lastIndex) + "/" + filePathToImport;

    console.log('a importar:', newFileRelativePath);

    let fileContent = ""
    $.get({
        url: newFileRelativePath,
        async: false
    })
    .done((data) => fileContent = data )
    .fail( (e, textStatus) => {
        console.log("Fallo al obtener archivo");
        console.log(e);
        if (e.status === 404) {
            throw new ast.SemanticError("No se encontro el import");
        }
        else {
            throw new ast.SemanticError("Fallo al importar archivo: " + textStatus);
        }
    });

    console.log("Se encontro el archivo");
    return getSentencesWithLocation(newFileRelativePath, fileContent);
}

function getSentencesWithLocation(relativePath, content) {
    parser.yy.paths.push(relativePath);
    const sentences = parser.parse(content);
    parser.yy.paths.pop(relativePath);
    return sentences;
}

const saveButton = $("#saveButton");
saveButton.click(function () {
    if (currenOpenFile === null) {
        alert("No hay nada que guardar")
    }
    else {

        saveFile(currenOpenFile.session.getValue(), currenOpenFile.path);
    }
});

function saveFile(content, path) {

    $.post( "/save-file", { content: content, path: path})
        .done(function( data ) {
            console.log("Status: ", data);
            console.log("Guardado: ", path);
            // alert( "Data Loaded: " + data );
        });

}






////////////////////////
//// Methods
////////////////////////

function getPublicPath(path){
    const PUBLIC = "public";
    return path.slice(path.indexOf(PUBLIC) + PUBLIC.length);
}

function openFile(file){

    // file.name

    // Bajando archivo

    const relativeDir = getPublicPath(file.path);
    console.log("Archivo:", relativeDir);

    const oldFile = hasFile(openFiles, file.path);

    if (oldFile) {
        openOldFile(oldFile);
    }
    else {
        $.get(relativeDir, function (data) {

            const session = ace.createEditSession(data, "ace/mode/java");


            // se agrega el tab
            const tab = $("<div></div>", { "class": "tab" } );
            tab.text(file.name);
            $("#tabs").append(tab);

            // se registra el file
            const oldFile = { path: file.path, session: session, tab : tab };
            openFiles.push(oldFile);

            // se registran los eventos
            tab.click(function () {
                openOldFile(oldFile);
            });
            tab.mouseup(function (e) {
                if (e.which === 2) {
                    closeOpenFile(openFiles, oldFile);
                }
            });

            // se habilita el editor
            editor.setReadOnly(false);

            openOldFile(oldFile);
            // editor.setSession(session);

        });
    }

}





function openOldFile(oldFile){

    currenOpenFile = oldFile;

    $(".tab").removeClass("tab-active");
    oldFile.tab.addClass("tab-active");

    editor.setSession(oldFile.session);
}
function closeOpenFile(files, oldFile){

    console.log("A cerrar archivo");

    oldFile.tab.remove();

    // remuevo el archivo del array
    var index = files.indexOf(oldFile);
    if (index > -1) {
        files.splice(index, 1);
    }

    if (files.length > 0) {
        // muestro el anterior
        const newIndex = index - 1;
        if (newIndex >= 0 && newIndex < files.length) {
            openFile(files[newIndex])
        }
        else {
            openFile(files[files.length - 1]);
        }
    }
    else {
        // desactivo todo
        currenOpenFile = null;
        editor.setReadOnly(true);
        editor.session.setValue("");
    }
}

function hasFile(files, path){
    for (const oldFile of files) {
        if (oldFile.path === path) {
            return oldFile;
        }
    }
    return null;
}

//tabla de simbolos

const tablaSimbolos = $("#tablaSimbolos");
tablaSimbolos.click(()=>{
    let cuerpo = create_html(tabla_body(arregloTS));
    download('reporte_tabla_simbolos.html',cuerpo);
});

const tablaFunciones = $("#tablaFunciones");
tablaFunciones.click(()=>{
    let cuerpo = create_html(funciones_body_reporte(arregloFunction));
    download('reporte_tabla_funciones.html',cuerpo);
});

const aux3D = $("#aux3D");
aux3D.click(()=>{
    let salida = `##salida para para los aux XD\n`;
    salida += `var Stack[];\nvar Heap[];\n`
    salida += editor3d.getValue();
    salida =  salida.split("//").join("##");
    salida =  salida.split("!=").join("<>");
    salida =  salida.split("%e").join("%i");

    editor3d.setValue(salida);
});


const optmizar3d = $("#optmizar3d");
optmizar3d.click(()=>{
       optimizar();
});


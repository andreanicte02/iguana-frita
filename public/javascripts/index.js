
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

function addSintaxError(hash) {



}
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
// editor.setTheme("ace/theme/monokai");
editor3d.session.setMode("ace/mode/java");

/*
editor3d.on("guttermousedown", function(e) {
    var target = e.domEvent.target;
    if (target.className.indexOf("ace_gutter-cell") === -1)
        return;
    if (!editor.isFocused())
        return;
    if (e.clientX > 25 + target.getBoundingClientRect().left)
        return;

    var row = e.getDocumentPosition().row;

    var breakpoints = e.editor.session.getBreakpoints(row, 0);
    // var row = e.getDocumentPosition().row;
    if(typeof breakpoints[row] === typeof undefined)
        e.editor.session.setBreakpoint(row);
    else
        e.editor.session.clearBreakpoint(row);


    // e.editor.session.setBreakpoint(row);
    e.stop();
});
*/

const editor = ace.edit("tab-content");
// editor.setTheme("ace/theme/monokai");
editor.setReadOnly(true);
// editor.session.setMode("ace/mode/java");


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

$("#debugButton")
    .click(()=>{

        clearErrors();

        const text3d = editor3d.getValue();
        if (text3d.trim().length === 0) {
            alert("No hay nada que debugear");
        }
        else {

            try {
                const sentences = parser3d.parse(text3d);
                // ast3d.process(sentences);
                debug3d(sentences);
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

const stepButton = $("#stepButton");
stepButton.click(()=>{
    safeStep(stepper);
});

let stepper = null;

function safeStep(_stepper){
    if (_stepper) {

        try {
            return _stepper();
        }
        catch (e) {
            if (e._semanticError){
                console.log(e._semanticError);
                alert(e.message);
            }
            else {
                console.log(e);
                alert(e.message);
            }
            return false;
        }
    }
    else {
        console.log("no se ha iniciado debug");
        return false;
    }
}

function debugToLine(line) {

    while (true) {
        const result = safeStep(stepper);
        console.log("result:",result);

        if (result === false) {
            // dio un error
            break;
        }
        if (result === -1) {
            // finalizo
            break;
        }

        if (result === line){
            // llegue a la linea que quiero
            break;
        }

    }
}

function debug3d(sentences){


    const z = new ast3d.ZContainer();
    const block  = new ast3d.Block3D(sentences);
    block.execute(z);

    stepper = function () {
        if (z.blocks.length) {
            const lastBlock = z.blocks[z.blocks.length - 1];
            const sentence = lastBlock.step(z);
            zz = z;
            if (sentence){

                const line = sentence._p.first_line - 1;

                editor3d.selection.moveCursorToPosition({row: line, column: 0});
                // editor.gotoLine(50, 10, true);
                editor3d.selection.selectLine();

                editor3d.scrollToLine(line, true, true, function () {});

                console.log(z._stack);
                console.log(z._heap);
                console.log("P:", z._vars.get("P"), "H:", z._vars.get("H"));
                console.log(sentence.cutePos());

                return line;
            }
        }
        else {
            console.log("termino");
            return -1;
        }
        return undefined;
    };


}


function process3d(sentences){
    myConsole.clear();

    const z = new ast3d.ZContainer();
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



const compileButton = $("#compileButton");
compileButton.click(()=>{

    clearErrors();

    if (currenOpenFile === null) {
        console.log(".....")
        alert("No hay ningun archivo abierto...");
    }
    else {

        const jText = editor.getValue(); // or session.getValue
        //const relativePath = getPublicPath(currenOpenFile.path);
        //console.log(relativePath)



            const nodos = parser.parse(jText);
            const texto = ast.generar3d(nodos);
            editor3d.setValue(texto);
            editor3d.clearSelection();


    }
});


function getSentencesWithLocation(relativePath, content) {
    //javaParser.yy.paths.push(relativePath);
    //const sentences = javaParser.parse(content);
    //javaParser.yy.paths.pop(relativePath);
    //return sentences;
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

            // $(".tab").removeClass("tab-active");

            // tab-active quitado

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






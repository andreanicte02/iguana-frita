function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function create_html(body) {
    let html=`<html>`
    html += `<title> Tabla Simbolos - Andrea Vicente </title>`
    html+=`<body>`;
    html+=body;
    html+=`</body>`;
    html+=`</html>`;
    return html;
}

function tabla_body(arreglo) {
    let txt = '<table class="egt">';


    txt += `<style>
                    table, th, td {
                    border: 1px solid black;
                }
            </style>`;

    txt+= '<tr>'
    txt+=  `<th> nombre </th>`
    txt+=  `<th> tipo </th>`
    txt+=  `<th> fila </th>`
    txt+=  `<th> columna </th>`
    txt+=  `<th> path </th>`
    txt+=  `<th> arreglo </th>`
    txt+= '</tr>'

    arreglo.forEach(value=>{
        txt+= '<tr>'

        txt+=  `<th> ${value.nombre} </th>`
        txt+=  `<th> ${value.tipo} </th>`
        txt+=  `<th> ${value.fila} </th>`
        txt+=  `<th> ${value.columna} </th>`
        txt+=  `<th> ${value.otro} </th>`
        txt+=  `<th> ${value.arreglo} </th>`

        txt+= '</tr>'
    });


    txt+= '</table>'
    txt+= '201404104-Andrea Vicente'
    return txt;
}

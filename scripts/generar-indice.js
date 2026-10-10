// Genera public/ejemplos/index.json con el arbol de archivos que muestra el panel izquierdo.
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'public');
const EJEMPLOS = path.join(PUBLIC, 'ejemplos');

function arbol(dir) {
    const entradas = fs.readdirSync(dir, { withFileTypes: true })
        .filter(e => e.name !== 'index.json' && !e.name.startsWith('.'))
        .sort((a, b) => (b.isDirectory() - a.isDirectory()) || a.name.localeCompare(b.name));

    return {
        name: path.basename(dir),
        path: path.relative(PUBLIC, dir).split(path.sep).join('/'),
        type: 'directory',
        children: entradas.map(e => {
            const ruta = path.join(dir, e.name);
            if (e.isDirectory()) {
                return arbol(ruta);
            }
            return { name: e.name, path: path.relative(PUBLIC, ruta).split(path.sep).join('/'), type: 'file' };
        }),
    };
}

fs.writeFileSync(path.join(EJEMPLOS, 'index.json'), JSON.stringify(arbol(EJEMPLOS), null, 2));
console.log('[/] ejemplos/index.json generado');

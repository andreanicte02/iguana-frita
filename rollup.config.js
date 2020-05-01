import typescript from 'rollup-plugin-typescript2';
export default {
    input: './public/javascripts/ts/jsharp/Main.ts', // our source file
    output: [
        {
            file: './public/javascripts/language.js',
            format: 'iife',
            name: 'ast', // the global which can be used in a browser
            sourcemap: true
        }
    ],
    plugins: [
        typescript({
            typescript: require('typescript'),
        }),
    ]
};
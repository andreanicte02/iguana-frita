var ast3d = (function (exports) {
    'use strict';

    class SymbolPosition {
    }
    function prueba3d(text) {
        /*
        const z = new ZContainer();
        const result: ((_: ZContainer) => any)[] = parser3d.parse(text);
        const block  = new Block3D(result);
        block.execute(z);
        console.log(z);
         */
    }
    // export function process(sentences: ExpressionNode[]) : string
    class Sentence {
        cutePos() {
            return `Linea: ${this._p.first_line}`;
        }
        constructor(p, action) {
            this._p = p;
            this._action = action;
        }
        op(z) {
            try {
                return this._action(z);
            }
            catch (e) {
                if (e instanceof SemanticError) {
                    throw new LocatedSemanticError(e, this._p);
                }
                throw e;
            }
        }
    }
    function m(p, action) {
        return new Sentence(p, action);
        /*return _ => {
            try {
                return action(_);
            }
            catch (e) {
                if (e instanceof SemanticError) {
                    throw new LocatedSemanticError(e, p);
                }
                throw e;
            }
        };*/
    }
    function mDiv(p, o1, o2) {
        return new Sentence(p, z => {
            const r1 = o1.op(z);
            const r2 = o2.op(z);
            if (r2 === 0) {
                throw new SemanticError("No es posible dividir dentro de cero");
            }
            return r1 / r2;
        });
        /*return _ => {
            try {
                // return action(_);
                const r1 = o1(_);
                const r2 = o2(_);
                if (r2 === 0) {
                    throw new SemanticError("No es posible dividir dentro de cero");
                }
                return r1 / r2;
            }
            catch (e) {
                if (e instanceof SemanticError) {
                    throw new LocatedSemanticError(e, p);
                }
                throw e;
            }
        };*/
    }
    function mMod(p, o1, o2) {
        return new Sentence(p, z => {
            const r1 = o1.op(z);
            const r2 = o2.op(z);
            if (r2 === 0) {
                throw new SemanticError("No es posible dividir dentro de cero");
            }
            return r1 % r2;
        });
        /*return _ => {
            try {
                // return action(_);
                const r1 = o1(_);
                const r2 = o2(_);
                if (r2 === 0) {
                    throw new SemanticError("No es posible modulo dentro de cero");
                }
                return r1 % r2;
            }
            catch (e) {
                if (e instanceof SemanticError) {
                    throw new LocatedSemanticError(e, p);
                }
                throw e;
            }
        };*/
    }
    // export function process(sentences: ((_: ZContainer) => any)[] ){
    //     const z = new ZContainer();
    //     const block  = new Block3D(sentences);
    //     block.execute(z);
    //     console.log(z);
    // }
    function prettyPos(position) {
        if (position === undefined)
            return "{}";
        return `Linea: ${position.first_line} Columna: ${position.first_column}`;
    }
    class SemanticError extends Error {
    }
    class LocatedSemanticError extends Error {
        get semanticError() {
            return this._semanticError;
        }
        constructor(semanticError, p) {
            super(prettyPos(p) + " - " + semanticError.message);
            this._semanticError = semanticError;
            this._p = p;
        }
    }
    class Block3D {
        constructor(sentences) {
            this.i = 0;
            this._sentences = sentences;
        }
        copy() {
            return new Block3D(this._sentences);
        }
        getPos(label) {
            for (let j = 0; j < this._sentences.length; j++) {
                // @ts-ignore
                if (this._sentences[j].flag === label) {
                    return j;
                }
            }
            throw new SemanticError(`No se tiene definido ningun label '${label}'`);
        }
        execute(z) {
            z.blocks.push(this);
            // metodos
            for (const sentence of this._sentences) {
                if (sentence.hasOwnProperty("lift")) {
                    sentence.op(z);
                }
            }
        }
        step(z) {
            if (this.i >= this._sentences.length) {
                this.i = 0;
                z.blocks.pop();
                return undefined;
            }
            const sentence = this._sentences[this.i];
            if (!sentence.hasOwnProperty("lift")) {
                const result = sentence.op(z);
                if (result) {
                    this.i = this.getPos(result);
                }
                const lastBlock = z.blocks[z.blocks.length - 1];
                if (lastBlock !== this) {
                    // fui cambiado
                    this.i = this.i + 1;
                    return lastBlock.possibleSentence(0);
                }
            }
            this.i = this.i + 1;
            return this.possibleSentence(this.i);
        }
        possibleSentence(next) {
            if (next >= this._sentences.length) {
                return undefined;
            }
            return this._sentences[next];
        }
    }
    class ZContainer {
        constructor() {
            this.blocks = [];
            this._vars = new Map();
            this._methods = new Map();
            this._stack = [];
            this._heap = [];
        }
        getFromHeap(index) {
            return this._heap[index] || 0;
        }
        getFromStack(index) {
            return this._stack[index] || 0;
        }
        setInHeap(index, value) {
            this._heap[index] = value;
        }
        setInStack(index, value) {
            this._stack[index] = value;
        }
        declareVar(identifier) {
            if (this._vars.has(identifier)) {
                throw new SemanticError(`Variable '${identifier}' ya declarada`);
            }
            this._vars.set(identifier, 0);
        }
        setDeclaredVarValue(identifier, value) {
            if (!this._vars.has(identifier)) {
                throw new SemanticError(`Variable '${identifier}' no declarada`);
            }
            this._vars.set(identifier, value);
        }
        declareMethod(identifier, sentences) {
            if (this._methods.has(identifier)) {
                throw new SemanticError(`Metodo '${identifier}' ya declarado`);
            }
            this._methods.set(identifier, new Block3D(sentences));
        }
        getDeclaredMethod(identifier) {
            if (!this._methods.has(identifier)) {
                throw new SemanticError(`Metodo '${identifier}' no declarado`);
            }
            return this._methods.get(identifier);
        }
        getDeclaredVarValue(identifier) {
            if (!this._vars.has(identifier)) {
                throw new SemanticError(`Variable '${identifier}' no declarada`);
            }
            return this._vars.get(identifier);
        }
        printFloat(value) {
            // @ts-ignore
            myConsole.log(value.toFixed(2)); // prints 4.00
        }
        printInteger(value) {
            // @ts-ignore
            myConsole.log(Math.trunc(value));
        }
        printChar(value) {
            // @ts-ignore
            myConsole.log(String.fromCharCode(value));
            // console.log(String.fromCharCode(value));
        }
    }

    exports.Block3D = Block3D;
    exports.LocatedSemanticError = LocatedSemanticError;
    exports.SemanticError = SemanticError;
    exports.SymbolPosition = SymbolPosition;
    exports.ZContainer = ZContainer;
    exports.m = m;
    exports.mDiv = mDiv;
    exports.mMod = mMod;
    exports.prueba3d = prueba3d;

    return exports;

}({}));

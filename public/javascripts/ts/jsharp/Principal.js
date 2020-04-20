"use strict";
exports.__esModule = true;
var parser = require('../../parser/Parser');
var Principal = /** @class */ (function () {
    function Principal() {
    }
    Principal.prototype.testParser = function () {
        try {
            var e = parser.parse("3+3*3");
        }
        catch (e) {
        }
    };
    return Principal;
}());
exports.Principal = Principal;
//# sourceMappingURL=Principal.js.map
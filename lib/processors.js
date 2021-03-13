(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Component", "./constants"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CssProcessor = exports.HtmlProcessor = exports.Processor = void 0;
    const Component_1 = require("./Component");
    const constants_1 = require("./constants");
    class Processor {
    }
    exports.Processor = Processor;
    const ensureArray = (substitute) => {
        return Array.isArray(substitute) ? substitute : [substitute];
    };
    class HtmlProcessor extends Processor {
        constructor(strings, substitutes) {
            super();
            this.strings = strings;
            this.substitutes = substitutes;
        }
        process(args) {
            return this.strings.reduce((html, string, index) => {
                let substitute = this.substitutes[index] ?? '';
                if (typeof substitute === 'function') {
                    substitute = substitute(args);
                }
                for (const item of ensureArray(substitute)) {
                    if (item instanceof Component_1.AyceComponent) {
                        item.parent = args.self;
                        string += item[constants_1.templateSymbol]();
                    }
                    else {
                        string += String(item);
                    }
                }
                return html + string;
            }, '');
        }
    }
    exports.HtmlProcessor = HtmlProcessor;
    class CssProcessor extends Processor {
        constructor(strings, substitutes) {
            super();
            this.strings = strings;
            this.substitutes = substitutes;
        }
        process(args) {
            return this.strings.reduce((css, string, index) => {
                let substitute = this.substitutes[index] ?? '';
                if (typeof substitute === 'function') {
                    substitute = substitute(args);
                }
                string += substitute instanceof Component_1.AyceComponent
                    ? substitute.selector
                    : String(substitute);
                return css + string;
            }, '');
        }
    }
    exports.CssProcessor = CssProcessor;
});

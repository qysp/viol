"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CssProcessor = exports.HtmlProcessor = exports.Processor = void 0;
var Component_1 = require("./Component");
var constants_1 = require("./constants");
var Processor = (function () {
    function Processor() {
    }
    return Processor;
}());
exports.Processor = Processor;
var ensureArray = function (substitute) {
    return Array.isArray(substitute) ? substitute : [substitute];
};
var HtmlProcessor = (function (_super) {
    __extends(HtmlProcessor, _super);
    function HtmlProcessor(strings, substitutes) {
        var _this = _super.call(this) || this;
        _this.strings = strings;
        _this.substitutes = substitutes;
        return _this;
    }
    HtmlProcessor.prototype.process = function (args) {
        var _this = this;
        return this.strings.reduce(function (html, string, index) {
            var _a;
            var substitute = (_a = _this.substitutes[index]) !== null && _a !== void 0 ? _a : '';
            if (typeof substitute === 'function') {
                substitute = substitute(args);
            }
            for (var _i = 0, _b = ensureArray(substitute); _i < _b.length; _i++) {
                var item = _b[_i];
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
    };
    return HtmlProcessor;
}(Processor));
exports.HtmlProcessor = HtmlProcessor;
var CssProcessor = (function (_super) {
    __extends(CssProcessor, _super);
    function CssProcessor(strings, substitutes) {
        var _this = _super.call(this) || this;
        _this.strings = strings;
        _this.substitutes = substitutes;
        return _this;
    }
    CssProcessor.prototype.process = function (args) {
        var _this = this;
        return this.strings.reduce(function (css, string, index) {
            var _a;
            var substitute = (_a = _this.substitutes[index]) !== null && _a !== void 0 ? _a : '';
            if (typeof substitute === 'function') {
                substitute = substitute(args);
            }
            string += substitute instanceof Component_1.AyceComponent
                ? substitute.selector
                : String(substitute);
            return css + string;
        }, '');
    };
    return CssProcessor;
}(Processor));
exports.CssProcessor = CssProcessor;

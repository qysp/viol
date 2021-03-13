"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = exports.getComponent = exports.css = exports.html = exports.Component = void 0;
var constants_1 = require("./constants");
var processors_1 = require("./processors");
function Component(def) {
    return function (target) {
        var _a;
        Object.defineProperties(target.prototype, {
            template: { value: def.template },
            styles: { value: def.styles },
            state: {
                value: (_a = def.state) !== null && _a !== void 0 ? _a : {},
                writable: true,
            },
        });
    };
}
exports.Component = Component;
var html = function (strings) {
    var substitutes = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        substitutes[_i - 1] = arguments[_i];
    }
    return new processors_1.HtmlProcessor(__spreadArray([], strings), substitutes);
};
exports.html = html;
var css = function (strings) {
    var substitutes = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        substitutes[_i - 1] = arguments[_i];
    }
    return new processors_1.CssProcessor(__spreadArray([], strings), substitutes);
};
exports.css = css;
var getComponent = function (name) {
    var _a;
    return (_a = window.AyceComponents.get(name)) !== null && _a !== void 0 ? _a : null;
};
exports.getComponent = getComponent;
var createApp = function (component, root) {
    var _a;
    var alpine = (_a = window.deferLoadingAlpine) !== null && _a !== void 0 ? _a : (function (cb) { return cb(); });
    window.deferLoadingAlpine = function (callback) {
        alpine(callback);
        root.innerHTML = component[constants_1.templateSymbol]();
        window.Alpine.onBeforeComponentInitialized(function (component) {
            if (typeof component.$data.onInit === 'function') {
                component.$data.onInit();
            }
        });
        window.Alpine.onComponentInitialized(function (component) {
            if (typeof component.$data.onAfterInit === 'function') {
                component.$data.onAfterInit();
            }
        });
    };
};
exports.createApp = createApp;

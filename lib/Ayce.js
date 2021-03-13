(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./constants", "./processors"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createApp = exports.getComponent = exports.css = exports.html = exports.Component = void 0;
    const constants_1 = require("./constants");
    const processors_1 = require("./processors");
    function Component(def) {
        return (target) => {
            Object.defineProperties(target.prototype, {
                template: { value: def.template },
                styles: { value: def.styles },
                state: {
                    value: def.state ?? {},
                    writable: true,
                },
            });
        };
    }
    exports.Component = Component;
    const html = (strings, ...substitutes) => {
        return new processors_1.HtmlProcessor([...strings], substitutes);
    };
    exports.html = html;
    const css = (strings, ...substitutes) => {
        return new processors_1.CssProcessor([...strings], substitutes);
    };
    exports.css = css;
    const getComponent = (name) => {
        return window.AyceComponents.get(name) ?? null;
    };
    exports.getComponent = getComponent;
    const createApp = (component, root) => {
        const alpine = window.deferLoadingAlpine ?? ((cb) => cb());
        window.deferLoadingAlpine = (callback) => {
            alpine(callback);
            root.innerHTML = component[constants_1.templateSymbol]();
            window.Alpine.onBeforeComponentInitialized((component) => {
                if (typeof component.$data.onInit === 'function') {
                    component.$data.onInit();
                }
            });
            window.Alpine.onComponentInitialized((component) => {
                if (typeof component.$data.onAfterInit === 'function') {
                    component.$data.onAfterInit();
                }
            });
        };
    };
    exports.createApp = createApp;
});

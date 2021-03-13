(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./util", "./constants"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AyceComponent = void 0;
    const util_1 = require("./util");
    const constants_1 = require("./constants");
    const generateName = (component) => {
        return `${component.constructor.name}_${util_1.uid()}`;
    };
    const process = (subject, args) => {
        if (typeof subject === 'function') {
            subject = subject(args);
        }
        if (typeof subject === 'string') {
            return subject;
        }
        return subject.process(args);
    };
    const defineAyceComponent = (name, component) => {
        if (window.AyceComponents.has(name)) {
            throw new Error(`[Ayce] Error: component with name '${name}' already exists!`);
        }
        window.AyceComponents.set(name, component);
    };
    const createReactivity = (component, state) => {
        return new Proxy(state, {
            get: (target, prop, receiver) => {
                const value = Reflect.get(target, prop, receiver);
                if (typeof value === 'object' && value !== null) {
                    return createReactivity(component, value);
                }
                return value;
            },
            set: (target, prop, value, receiver) => {
                const success = Reflect.set(target, prop, value, receiver);
                if (success && component.$el instanceof HTMLElement && component.$el.__x !== undefined) {
                    component.$el.__x.updateElements(component.$el);
                }
                return success;
            },
        });
    };
    class AyceComponent {
        constructor(props, name) {
            this.name = name ?? generateName(this);
            this.selector = `[x-name="${this.name}"]`;
            defineAyceComponent(this.name, this);
            this.props = props ?? {};
            this.state = createReactivity(this, { ...this.state });
        }
        [constants_1.templateSymbol]() {
            const substituteArgs = {
                props: this.props,
                state: this.state,
                self: this,
            };
            const html = process(this.template, substituteArgs);
            const fragment = util_1.createFragment(html);
            const root = fragment.firstElementChild;
            if (root !== null) {
                root.setAttribute('x-name', this.name);
                root.setAttribute('x-data', `AyceComponents.get('${this.name}')`);
            }
            if (this.styles !== undefined) {
                const styleElement = document.createElement('style');
                styleElement.innerHTML = process(this.styles, substituteArgs);
                document.head.appendChild(styleElement);
            }
            return Array.from(fragment.children).reduce((markup, child) => {
                return markup + child.outerHTML;
            }, '');
        }
    }
    exports.AyceComponent = AyceComponent;
});

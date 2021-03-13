"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AyceComponent = void 0;
var util_1 = require("./util");
var constants_1 = require("./constants");
var generateName = function (component) {
    return component.constructor.name + "_" + util_1.uid();
};
var process = function (subject, args) {
    if (typeof subject === 'function') {
        subject = subject(args);
    }
    if (typeof subject === 'string') {
        return subject;
    }
    return subject.process(args);
};
var defineAyceComponent = function (name, component) {
    if (window.AyceComponents.has(name)) {
        throw new Error("[Ayce] Error: component with name '" + name + "' already exists!");
    }
    window.AyceComponents.set(name, component);
};
var createReactivity = function (component, state) {
    return new Proxy(state, {
        get: function (target, prop, receiver) {
            var value = Reflect.get(target, prop, receiver);
            if (typeof value === 'object' && value !== null) {
                return createReactivity(component, value);
            }
            return value;
        },
        set: function (target, prop, value, receiver) {
            var success = Reflect.set(target, prop, value, receiver);
            if (success && component.$el instanceof HTMLElement && component.$el.__x !== undefined) {
                component.$el.__x.updateElements(component.$el);
            }
            return success;
        },
    });
};
var AyceComponent = (function () {
    function AyceComponent(props, name) {
        this.name = name !== null && name !== void 0 ? name : generateName(this);
        this.selector = "[x-name=\"" + this.name + "\"]";
        defineAyceComponent(this.name, this);
        this.props = props !== null && props !== void 0 ? props : {};
        this.state = createReactivity(this, __assign({}, this.state));
    }
    AyceComponent.prototype[constants_1.templateSymbol] = function () {
        var substituteArgs = {
            props: this.props,
            state: this.state,
            self: this,
        };
        var html = process(this.template, substituteArgs);
        var fragment = util_1.createFragment(html);
        var root = fragment.firstElementChild;
        if (root !== null) {
            root.setAttribute('x-name', this.name);
            root.setAttribute('x-data', "AyceComponents.get('" + this.name + "')");
        }
        if (this.styles !== undefined) {
            var styleElement = document.createElement('style');
            styleElement.innerHTML = process(this.styles, substituteArgs);
            document.head.appendChild(styleElement);
        }
        return Array.from(fragment.children).reduce(function (markup, child) {
            return markup + child.outerHTML;
        }, '');
    };
    return AyceComponent;
}());
exports.AyceComponent = AyceComponent;

import { createFragment, uid } from './util';
import { templateSymbol } from './constants';
const generateName = (component) => {
    return `${component.constructor.name}_${uid()}`;
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
const defineAlpineComponent = (name, component) => {
    if (window.AlpineComponents.has(name)) {
        throw new Error(`[Ayce] Error: component with name '${name}' already exists!`);
    }
    window.AlpineComponents.set(name, component);
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
export class AlpineComponent {
    constructor(props, name) {
        this.name = name ?? generateName(this);
        this.selector = `[x-name="${this.name}"]`;
        defineAlpineComponent(this.name, this);
        this.props = props ?? {};
        this.state = createReactivity(this, { ...this.state });
    }
    onInit() {
        return () => this.onAfterInit();
    }
    onAfterInit() { }
    [templateSymbol]() {
        const substituteArgs = {
            props: this.props,
            state: this.state,
            self: this,
        };
        const html = process(this.template, substituteArgs);
        const fragment = createFragment(html);
        const root = fragment.firstElementChild;
        if (root !== null) {
            root.setAttribute('x-name', this.name);
            root.setAttribute('x-data', `AlpineComponents.get('${this.name}')`);
            root.setAttribute('x-init', 'onInit() ? onAfterInit : onAfterInit');
            if (this.styles !== undefined) {
                const styleElement = document.createElement('style');
                styleElement.innerHTML = process(this.styles, substituteArgs);
                root.prepend(styleElement);
            }
        }
        return [...fragment.children].reduce((markup, child) => {
            return markup + child.outerHTML;
        }, '');
    }
}

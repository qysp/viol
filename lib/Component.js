import { createFragment, uid } from './util';
import { templateSymbol } from './constants';
const generateName = (component) => {
    return `${component.constructor.name}_${uid()}`;
};
const defineAlpineComponent = (name, component) => {
    if (name in window.AlpineComponents) {
        throw new Error(`[Ayce] Error: component with name '${name}' already exists!`);
    }
    window.AlpineComponents[name] = component;
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
        defineAlpineComponent(this.name, this);
        this.props = props ?? {};
        this.state = createReactivity(this, { ...this.state });
    }
    get selector() {
        return `[x-name="${this.name}"]`;
    }
    onInit() {
        return () => this.onAfterInit();
    }
    onAfterInit() { }
    [templateSymbol]() {
        const templateArgs = {
            props: this.props,
            state: this.state,
            self: this,
        };
        const html = typeof this.template === 'string'
            ? this.template
            : this.template(templateArgs);
        const styles = typeof this.styles !== 'function'
            ? this.styles
            : this.styles(templateArgs);
        const fragment = createFragment(html);
        const root = fragment.firstElementChild;
        if (root !== null) {
            root.setAttribute('x-name', this.name);
            root.setAttribute('x-data', `AlpineComponents['${this.name}']`);
            root.setAttribute('x-init', 'onInit() ? onAfterInit : onAfterInit');
            if (styles !== undefined) {
                const styleElement = document.createElement('style');
                styleElement.innerHTML = styles;
                root.prepend(styleElement);
            }
        }
        return [...fragment.children].reduce((markup, child) => {
            return markup + child.outerHTML;
        }, '');
    }
}

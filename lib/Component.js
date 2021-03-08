import { validateProps } from './props';
import { createFragment, uid } from './util';
const generateName = (component) => {
    return `${component.constructor.name}_${uid()}`;
};
const defineAlpineComponent = (name, component) => {
    if (!Object.prototype.hasOwnProperty.call(window, 'AlpineComponents')) {
        window.AlpineComponents = {};
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
    constructor(props) {
        this.name = generateName(this);
        defineAlpineComponent(this.name, this);
        this.props = validateProps(props, this.propTypes);
        this.state = createReactivity(this, { ...this.state });
    }
    onInit() { }
    __getTemplate() {
        const html = typeof this.template === 'string'
            ? this.template
            : this.template({
                props: this.props,
                state: this.state,
                self: this,
            });
        const fragment = createFragment(html);
        const root = fragment.firstElementChild;
        if (root !== null) {
            root.setAttribute('x-data', `AlpineComponents['${this.name}']`);
            let xInit = root.hasAttribute('x-init')
                ? `${root.getAttribute('x-init')}; `
                : '';
            root.setAttribute('x-init', xInit + 'onInit()');
        }
        return [...fragment.children].reduce((markup, child) => {
            return markup + child.outerHTML;
        }, '');
    }
}

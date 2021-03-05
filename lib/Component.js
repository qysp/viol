import { validateProps } from './props';
import { uid } from './util';
const generateName = (component) => {
    return `${component.constructor.name}_${uid()}`;
};
const defineAlpineComponent = (name, component) => {
    if (!Object.prototype.hasOwnProperty.call(window, 'AlpineComponents')) {
        window.AlpineComponents = {};
    }
    window.AlpineComponents[name] = component;
};
const createFragment = (html) => {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content;
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
    __getTemplate() {
        let html;
        if (typeof this.template === 'function') {
            html = this.template({
                props: this.props,
                state: this.state,
                self: this,
            });
        }
        else {
            html = this.template;
        }
        const fragment = createFragment(html);
        fragment.firstElementChild?.setAttribute('x-data', `AlpineComponents['${this.name}']`);
        return [...fragment.children].reduce((markup, child) => {
            return markup + child.outerHTML;
        }, '');
    }
}

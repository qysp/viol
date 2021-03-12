import { AlpineComponent } from './Component';
import { has } from './util';
import { templateSymbol } from './constants';
export function Component(def) {
    return (target) => {
        Object.defineProperties(target.prototype, {
            template: { value: def.template },
            styles: { value: def.styles },
            state: { value: def.state ?? {}, writable: true },
        });
    };
}
export const html = (strings, ...substitutes) => {
    return (args) => {
        return [...strings].reduce((html, string, index) => {
            let substitute = substitutes[index] ?? '';
            if (typeof substitute === 'function') {
                substitute = substitute(args);
            }
            if (substitute instanceof AlpineComponent) {
                substitute.parent = args.self;
                string += substitute[templateSymbol]();
            }
            else {
                string += String(substitute);
            }
            return html + string;
        }, '');
    };
};
export const css = (strings, ...substitutes) => {
    return (args) => {
        return [...strings].reduce((css, string, index) => {
            let substitute = substitutes[index] ?? '';
            if (typeof substitute === 'function') {
                substitute = substitute(args);
            }
            return css + string + String(substitute);
        }, '');
    };
};
export const getComponent = (name) => {
    if (!has(window.AlpineComponents, name)) {
        return null;
    }
    return window.AlpineComponents[name];
};
export const createApp = (component, root) => {
    const alpine = window.deferLoadingAlpine ?? ((cb) => cb());
    window.deferLoadingAlpine = (callback) => {
        alpine(callback);
        root.innerHTML = component[templateSymbol]();
    };
};

import { AlpineComponent } from './Component';
import { Mod, } from './types';
export const required = (type) => [type, Mod.Required];
export const withDefault = (type, defaultValue) => [type, Mod.Default, defaultValue];
export function Component(def) {
    return (target) => {
        Object.defineProperties(target.prototype, {
            template: { value: def.template },
            state: { value: def.state ?? {}, writable: true },
            propTypes: { value: def.propTypes ?? {} },
        });
    };
}
export const html = (strings, ...substitutes) => {
    return (options) => {
        return [...strings].reduce((html, string, index) => {
            const substitute = substitutes[index];
            if (substitute instanceof AlpineComponent) {
                string += substitute.__getTemplate();
            }
            else if (typeof substitute === 'function') {
                const component = substitute(options);
                string += component.__getTemplate();
            }
            else {
                string += substitute;
            }
            return html + string;
        }, '');
    };
};
export const createApp = (component, root) => {
    const alpine = window.deferLoadingAlpine ?? ((cb) => cb());
    window.deferLoadingAlpine = (callback) => {
        alpine(callback);
        root.innerHTML = component.__getTemplate();
    };
};

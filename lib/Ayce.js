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
    return (args) => {
        return [...strings].reduce((html, string, index) => {
            let substitute = substitutes[index];
            if (typeof substitute === 'function') {
                substitute = substitute(args);
            }
            string += substitute instanceof AlpineComponent
                ? substitute.__getTemplate()
                : String(substitute);
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

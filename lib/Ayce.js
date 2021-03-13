import { has } from './util';
import { templateSymbol } from './constants';
import { CssProcessor, HtmlProcessor } from './processors';
export function Component(def) {
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
export const html = (strings, ...substitutes) => {
    return new HtmlProcessor([...strings], substitutes);
};
export const css = (strings, ...substitutes) => {
    return new CssProcessor([...strings], substitutes);
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

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const UidGenerator = (function* (id = 0) {
    while (++id)
        yield (id + Math.random()).toString(36);
})();
const uid = () => UidGenerator.next().value;
const createElement = (tagName, innerHTML) => {
    const element = document.createElement(tagName);
    element.innerHTML = innerHTML;
    return element;
};
const createFragment = (html) => {
    const template = createElement('template', html);
    return template.content;
};

const generateName = (component) => {
    return `${component.constructor.name}_${uid()}`;
};
const defineViolComponent = (name, component) => {
    if (window.ViolComponents.has(name)) {
        throw new Error(`[Viol] Error: component with name '${name}' already exists!`);
    }
    window.ViolComponents.set(name, component);
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
            if (Reflect.get(target, prop, receiver) === value) {
                return true;
            }
            const success = Reflect.set(target, prop, value, receiver);
            if (success && component.$el instanceof HTMLElement && component.$el.__x !== undefined) {
                component.$el.__x.updateElements(component.$el);
            }
            return success;
        },
    });
};
class ViolComponent {
    constructor(props, name) {
        this.name = name !== null && name !== void 0 ? name : generateName(this);
        this.selector = `[x-name="${this.name}"]`;
        defineViolComponent(this.name, this);
        this.props = props !== null && props !== void 0 ? props : {};
        this.state = createReactivity(this, Object.assign({}, this.state));
    }
}

class Processor {
}

class CSSProcessor extends Processor {
    constructor(strings, substitutes) {
        super();
        this.strings = strings;
        this.substitutes = substitutes;
    }
    process(args) {
        return this.strings.reduce((css, string, index) => {
            const sub = this.processSubstitute(this.substitutes[index - 1], args);
            return css + sub + string;
        });
    }
    processSubstitute(substitute, args) {
        if (typeof substitute === 'function') {
            substitute = substitute(args);
        }
        return substitute instanceof ViolComponent
            ? substitute.selector
            : String(substitute);
    }
}

const process = (subject, args) => {
    if (typeof subject === 'function') {
        subject = subject(args);
    }
    if (typeof subject === 'string') {
        return subject;
    }
    return subject.process(args);
};
const processTemplate = (template, args) => {
    const html = process(template, args);
    const fragment = createFragment(html);
    const root = fragment.firstElementChild;
    if (root !== null) {
        root.setAttribute('x-name', args.self.name);
        root.setAttribute('x-data', `ViolComponents.get('${args.self.name}')`);
    }
    return Array.from(fragment.children).reduce((markup, child) => {
        return markup + child.outerHTML;
    }, '');
};
const processStyles = (styles, args) => {
    if (styles === undefined) {
        return '';
    }
    return process(styles, args);
};
const processComponent = (component) => {
    const args = {
        props: component.props,
        state: component.state,
        self: component,
    };
    const html = processTemplate(component.template, args);
    const css = processStyles(component.styles, args);
    window.ViolStyles.push(css);
    return html;
};

class HTMLProcessor extends Processor {
    constructor(strings, substitutes) {
        super();
        this.strings = strings;
        this.substitutes = substitutes;
    }
    process(args) {
        return this.strings.reduce((html, string, index) => {
            const sub = this.processSubstitute(this.substitutes[index - 1], args);
            return html + sub + string;
        });
    }
    processSubstitute(substitute, args) {
        if (typeof substitute === 'function') {
            substitute = substitute(args);
        }
        return this.ensureArray(substitute).reduce((template, item) => {
            if (item instanceof ViolComponent) {
                if (item === args.self) {
                    throw new Error('[Viol] Error: cannot reference component in its own template');
                }
                item.parent = args.self;
                template += processComponent(item);
            }
            else if (item instanceof Processor) {
                template += item.process(args);
            }
            else if (typeof item === 'function') {
                template += this.processSubstitute(item, args);
            }
            else {
                template += String(item);
            }
            return template;
        }, '');
    }
    ensureArray(substitute) {
        return Array.isArray(substitute) ? substitute : [substitute];
    }
}

function Component(def) {
    return (target) => {
        var _a;
        Object.defineProperties(target.prototype, {
            template: { value: def.template },
            styles: { value: def.styles },
            state: {
                value: (_a = def.state) !== null && _a !== void 0 ? _a : {},
                writable: true,
            },
        });
    };
}
const html = (strings, ...substitutes) => {
    return new HTMLProcessor([...strings], substitutes);
};
const css = (strings, ...substitutes) => {
    return new CSSProcessor([...strings], substitutes);
};
const getComponent = (name) => {
    var _a;
    return (_a = window.ViolComponents.get(name)) !== null && _a !== void 0 ? _a : null;
};
const createApp = (component, root, options) => {
    var _a;
    const alpine = (_a = window.deferLoadingAlpine) !== null && _a !== void 0 ? _a : ((cb) => cb());
    window.deferLoadingAlpine = (callback) => {
        alpine(callback);
        root.innerHTML = processComponent(component);
        const styleSheet = createElement('style', window.ViolStyles.join(''));
        document.head.appendChild(styleSheet);
        window.Alpine.onBeforeComponentInitialized((component) => {
            if (typeof component.$data.onInit === 'function') {
                component.$data.onInit();
            }
        });
        window.Alpine.onComponentInitialized((component) => {
            if (typeof component.$data.onAfterInit === 'function') {
                component.$data.onAfterInit();
            }
        });
    };
    if (Array.isArray(options === null || options === void 0 ? void 0 : options.with)) {
        for (const initializer of options.with) {
            initializer();
        }
    }
};

if (!('ViolComponents' in window)) {
    window.ViolComponents = new Map();
}
if (!('ViolStyles' in window)) {
    window.ViolStyles = [];
}

exports.Component = Component;
exports.ViolComponent = ViolComponent;
exports.createApp = createApp;
exports.css = css;
exports.getComponent = getComponent;
exports.html = html;

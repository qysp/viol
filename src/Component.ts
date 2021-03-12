import { Props, State, Template } from './types';
import { createFragment, has, uid } from './util';

declare global {
  interface Window {
    AlpineComponents: Record<string, AlpineComponent>;
    deferLoadingAlpine?: (callback: Function) => any;
  }
}

interface AlpineElement<E extends HTMLElement, S extends State, P extends Props> {
  __x: {
    $data: AlpineComponent<S, P>;
    $el: AlpineElement<E, S, P>;
    membrane: Object;
    nextTickStack: any[];
    showDirectiveLastElement?: E;
    showDirectiveStack: any[];
    unobservedData: AlpineComponent<S, P>;
    watchers: Record<string, Function[]>;
    updateElement(el: HTMLElement, extraVars?: () => any): void;
    updateElements(rootEl: HTMLElement, extraVars?: () => any): void;
  }
}

const generateName = (component: AlpineComponent) => {
  return `${component.constructor.name}_${uid()}`;
}

const defineAlpineComponent = (name: string, component: AlpineComponent) => {
  if (name in window.AlpineComponents) {
    throw new Error(`[Ayce] Error: component with name '${name}' already exists!`);
  }
  window.AlpineComponents[name] = component;
};

const createReactivity = <S extends State>(component: AlpineComponent, state: S): S => {
  return new Proxy(state, {
    get: (target, prop, receiver) => {
      // console.debug(`[${component.name}] Get state:`, target, prop);
      const value = Reflect.get(target, prop, receiver);
      if (typeof value === 'object' && value !== null) {
        // console.debug(`[${component.name}] Create reactivity:`, target, prop, value);
        return createReactivity<S[keyof S]>(component, value);
      }
      return value;
    },
    set: (target, prop, value, receiver) => {
      // console.debug(`[${component.name}] State change:`, target, prop, value);
      const success = Reflect.set(target, prop, value, receiver);
      if (success && component.$el instanceof HTMLElement && component.$el.__x !== undefined) {
        // console.debug(`[${component.name}] Update elements:`, component.$el);
        component.$el.__x.updateElements(component.$el);
      }
      return success;
    },
  });
}

export class AlpineComponent<S extends State = {}, P extends Props = {}> {
  readonly name: string;

  template!: Template<AlpineComponent>;
  state!: S;
  props!: P;

  parent?: AlpineComponent;

  readonly $el!: AlpineElement<HTMLElement, S, P>;
  readonly $nextTick!: (callback: Function) => void;
  readonly $refs!: Record<string, HTMLElement>;
  readonly $watch!: (property: string, callback: Function) => void;

  constructor(props?: P, name?: string) {
    this.name = name ?? generateName(this);
    defineAlpineComponent(this.name, this);
    this.props = props ?? {} as P;
    this.state = createReactivity(this, { ...this.state });
  }

  /**
   * @private
   */
  __getTemplate(): string {
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
      // Register component for Alpine.
      root.setAttribute('x-data', `AlpineComponents['${this.name}']`);
      // Add/append onInit method.
      if (has(this, 'onInit') && typeof this.onInit === 'function') {
        let xInit = root.hasAttribute('x-init')
          ? `${root.getAttribute('x-init')}; `
          : '';
        root.setAttribute('x-init', xInit + 'onInit()');
      }
    }

    return [...fragment.children].reduce((markup, child) => {
      return markup + child.outerHTML;
    }, '');
  }
}

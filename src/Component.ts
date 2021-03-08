import { Props, PropTypes, State, Template } from './types';
import { validateProps } from './props';
import { createFragment, uid } from './util';

declare global {
  interface Window {
    AlpineComponents: Record<string, AlpineComponent<State, Props>>;
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
  if (!Object.prototype.hasOwnProperty.call(window, 'AlpineComponents')) {
    window.AlpineComponents = {};
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
  propTypes!: PropTypes;

  readonly $el!: AlpineElement<HTMLElement, S, P>;
  readonly $nextTick!: (callback: Function) => void;
  readonly $refs!: Record<string, HTMLElement>;
  readonly $watch!: (property: string, callback: Function) => void;

  constructor(props?: P) {
    this.name = generateName(this);
    defineAlpineComponent(this.name, this);
    this.props = validateProps(props, this.propTypes);
    this.state = createReactivity(this, { ...this.state });
  }

  protected onInit(): void {}

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

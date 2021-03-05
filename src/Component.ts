import { Props, PropTypes, State, Template } from './types';
import { validateProps } from './props';
import { uid } from './util';

declare global {
  interface Window {
    AlpineComponents: Record<string, AlpineComponent<State, Props>>;
    deferLoadingAlpine?: (callback: Function) => any;
  }
}

interface AlpineElement<E extends HTMLElement, S extends State, P extends Props> {
  __x: {
    $data: AlpineComponent<S, P>;
    $el: E;
    membrane: Object;
    nextTickStack: any[];
    showDirectiveLastElement?: E | HTMLElement;
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

const createFragment = (html: string) => {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content;
}

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
  }) as S;
}

export class AlpineComponent<S extends State = {}, P extends Props = {}> {
  readonly name: string;

  template!: Template<AlpineComponent>;
  state!: S;
  props: P;
  propTypes?: PropTypes;

  readonly $el!: AlpineElement<HTMLElement, S, P>;
  readonly $nextTick!: (callback: Function) => void;
  readonly $refs!: Record<string, HTMLElement>;
  readonly $watch!: (property: string, callback: Function) => void;

  constructor(props?: P) {
    this.name = generateName(this);
    defineAlpineComponent(this.name, this);
    this.props = validateProps<P>(props, this.propTypes);
    this.state = createReactivity<S>(this, { ...this.state });
    // Object.assign(this, { ...this.state });
  }

  /**
   * @private
   */
  __getTemplate(): string {
    let html: string;
    if (typeof this.template === 'function') {
      html = this.template({
        props: this.props,
        state: this.state,
        self: this,
      });
    } else {
      html = this.template;
    }
    const fragment = createFragment(html);
    fragment.firstElementChild?.setAttribute(
      'x-data',
      `AlpineComponents['${this.name}']`,
    );
    return [...fragment.children].reduce((markup, child) => {
      return markup + child.outerHTML;
    }, '');
  }
}

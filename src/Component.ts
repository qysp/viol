import {
  AlpineElement,
  Props,
  State,
  Styles,
  SubstituteArgs,
  Template,
} from './types';
import { createFragment, uid } from './util';
import { templateSymbol } from './constants';

declare global {
  interface Window {
    AlpineComponents: Record<string, AlpineComponent>;
    deferLoadingAlpine?: (callback: Function) => any;
  }
}

const generateName = <C extends AlpineComponent>(component: C): string => {
  return `${component.constructor.name}_${uid()}`;
}

const process = (
  subject: Styles<any> | Template<any>,
  args: SubstituteArgs<any>,
): string => {
  if (typeof subject === 'function') {
    subject = subject(args);
  }
  if (typeof subject === 'string') {
    return subject;
  }
  return subject.process(args)
}

const defineAlpineComponent = <C extends AlpineComponent>(name: string, component: C): void => {
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
  readonly selector: string;

  template!: Template<AlpineComponent>;
  styles?: Styles<AlpineComponent>;
  state!: S;
  props: P;

  parent?: AlpineComponent;

  readonly $el!: AlpineElement<HTMLElement, this>;
  readonly $nextTick!: (callback: () => void) => void;
  readonly $refs!: Record<string, HTMLElement>;
  readonly $watch!: (property: string, callback: (value: unknown) => void) => void;

  constructor(props?: P, name?: string) {
    this.name = name ?? generateName(this);
    this.selector = `[x-name="${this.name}"]`;
    defineAlpineComponent(this.name, this);
    this.props = props ?? {} as P;
    this.state = createReactivity(this, { ...this.state });
  }

  protected onInit(): void | (() => void) {
    return () => this.onAfterInit();
  }

  protected onAfterInit(): void {}

  /**
   * @private
   */
  [templateSymbol](): string {
    const substituteArgs: SubstituteArgs<AlpineComponent> = {
      props: this.props,
      state: this.state,
      self: this,
    };
    const html = process(this.template, substituteArgs);
    const fragment = createFragment(html);
    const root = fragment.firstElementChild;
    if (root !== null) {
      // Make this component queryable for css selectors.
      root.setAttribute('x-name', this.name);
      // Register component for Alpine.
      root.setAttribute('x-data', `AlpineComponents['${this.name}']`);
      // Workaround to ensure the result of Alpine's `saferEval` is always our onAfterInit method.
      root.setAttribute('x-init', 'onInit() ? onAfterInit : onAfterInit');
      // Insert style as first child of the root element.
      if (this.styles !== undefined) {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = process(this.styles, substituteArgs);
        root.prepend(styleElement);
      }
    }
    return [...fragment.children].reduce((markup, child) => {
      return markup + child.outerHTML;
    }, '');
  }
}

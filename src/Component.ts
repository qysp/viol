import {
  Alpine,
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
    Alpine: Alpine;
    AyceComponents: Map<string, AyceComponent<any, any>>;
    deferLoadingAlpine?: (callback: Function) => any;
  }
}

const generateName = <C extends AyceComponent>(component: C): string => {
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

const defineAyceComponent = <C extends AyceComponent>(name: string, component: C): void => {
  if (window.AyceComponents.has(name)) {
    throw new Error(`[Ayce] Error: component with name '${name}' already exists!`);
  }
  window.AyceComponents.set(name, component);
};

const createReactivity = <S extends State>(component: AyceComponent<any, any>, state: S): S => {
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

export interface AyceComponent<S extends State, P extends Props> {
  template: Template<AyceComponent<any, any>>;
  styles?: Styles<AyceComponent<any, any>>;
  state: S;
  props: P;

  parent?: AyceComponent<any, any>;

  readonly $el?: AlpineElement<HTMLElement, this>;
  readonly $nextTick: (callback: () => void) => void;
  readonly $refs: Record<string, HTMLElement>;
  readonly $watch: (property: string, callback: (value: unknown) => void) => void;

  onInit?(): void;
  onAfterInit?(): void;
  [templateSymbol](): string;
}

export class AyceComponent<S extends State = {}, P extends Props = {}> {
  readonly name: string;
  readonly selector: string;

  constructor(props?: P, name?: string) {
    this.name = name ?? generateName(this);
    this.selector = `[x-name="${this.name}"]`;
    defineAyceComponent(this.name, this);
    this.props = props ?? {} as P;
    this.state = createReactivity(this, { ...this.state });
  }

  [templateSymbol](): string {
    const substituteArgs: SubstituteArgs<AyceComponent<any, any>> = {
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
      root.setAttribute('x-data', `AyceComponents.get('${this.name}')`);
    }
    // Insert style as a child of the document's head element.
    // TODO: We should aggregate all styles and merge them in a single style element.
    if (this.styles !== undefined) {
      const styleElement = document.createElement('style');
      styleElement.innerHTML = process(this.styles, substituteArgs);
      document.head.appendChild(styleElement);
    }
    return Array.from(fragment.children).reduce((markup, child) => {
      return markup + child.outerHTML;
    }, '');
  }
}

import {
  AlpineElement,
  Props,
  State,
  Styles,
  Template,
} from './types';
import { uid } from './internal/util';

const generateName = <C extends ViolComponent>(component: C): string => {
  return `${component.constructor.name}_${uid()}`;
};

const defineViolComponent = <C extends ViolComponent>(name: string, component: C): void => {
  if (window.ViolComponents.has(name)) {
    throw new Error(`[Viol] Error: component with name '${name}' already exists!`);
  }
  window.ViolComponents.set(name, component);
};

const createReactivity = <S extends State>(component: ViolComponent, state: S): S => {
  return new Proxy(state, {
    get: (target, prop, receiver) => {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value === 'object' && value !== null) {
        return createReactivity<S[keyof S]>(component, value);
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

export interface ViolComponent<S extends State, P extends Props> {
  template: Template<ViolComponent>;
  styles?: Styles<ViolComponent>;
  state: S;
  props: P;

  parent?: ViolComponent;

  readonly $el?: AlpineElement<HTMLElement, this>;
  readonly $nextTick: (callback: () => void) => void;
  readonly $refs: Record<string, HTMLElement>;
  readonly $watch: (property: string, callback: (value: unknown) => void) => void;

  onInit?(): void;
  onAfterInit?(): void;
  onDestroy?(): void;
}

export class ViolComponent<S extends State = any, P extends Props = any> {
  readonly name: string;
  readonly selector: string;

  constructor(props?: P, name?: string) {
    this.name = name ?? generateName(this);
    this.selector = `[x-name="${this.name}"]`;
    defineViolComponent(this.name, this);
    this.props = props ?? {} as P;
    this.state = createReactivity(this, { ...this.state });
  }
}

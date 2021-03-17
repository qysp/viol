import {
  AlpineElement,
  Props,
  State,
  Styles,
  Template,
} from './types';
import { uid } from './internal/util';

const generateName = <C extends AyceComponent>(component: C): string => {
  return `${component.constructor.name}_${uid()}`;
}

const defineAyceComponent = <C extends AyceComponent>(name: string, component: C): void => {
  if (window.AyceComponents.has(name)) {
    throw new Error(`[Ayce] Error: component with name '${name}' already exists!`);
  }
  window.AyceComponents.set(name, component);
};

const createReactivity = <S extends State>(component: AyceComponent, state: S): S => {
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
  template: Template<AyceComponent>;
  styles?: Styles<AyceComponent>;
  state: S;
  props: P;

  parent?: AyceComponent;

  readonly $el?: AlpineElement<HTMLElement, this>;
  readonly $nextTick: (callback: () => void) => void;
  readonly $refs: Record<string, HTMLElement>;
  readonly $watch: (property: string, callback: (value: unknown) => void) => void;

  onInit?(): void;
  onAfterInit?(): void;
}

export class AyceComponent<S extends State = any, P extends Props = any> {
  readonly name: string;
  readonly selector: string;

  constructor(props?: P, name?: string) {
    this.name = name ?? generateName(this);
    this.selector = `[x-name="${this.name}"]`;
    defineAyceComponent(this.name, this);
    this.props = props ?? {} as P;
    this.state = createReactivity(this, { ...this.state });
  }
}

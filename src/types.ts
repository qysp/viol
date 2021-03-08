import { AlpineComponent } from './Component';

export type IsEmpty<T, Y = true, N = false> = T extends { [key: string]: never } ? Y : N;

export type State = Record<string, any>;
export type Props = Record<string, ReturnType<Type> | undefined | null>;

export type ComponentDef<C extends AlpineComponent> = {
  template: Template<C>;
  propTypes?: Partial<PropTypes<keyof PropsOf<C>>>;
} & IsEmpty<StateOf<C>, { state?: StateOf<C> }, { state: StateOf<C> }>;

export enum Mod {
  Required,
  Default,
}

export type PropsOf<C> = C extends AlpineComponent<State, infer P> ? P : never;
export type StateOf<C> = C extends AlpineComponent<infer S, Props> ? S : never;

export type TemplateArgs<C extends AlpineComponent> = {
  state: StateOf<C>;
  props: PropsOf<C>;
  self: C;
};
export type TemplateFunction<C extends AlpineComponent = AlpineComponent> = (args: TemplateArgs<C>) => string;
export type Template<C extends AlpineComponent> = string | TemplateFunction<C>;

export type Substitute<C extends AlpineComponent> =
  | string
  | number
  | boolean
  | AlpineComponent
  | ((args: TemplateArgs<C>) => AlpineComponent | string);

// TODO: remove proptypes
export type Type = StringConstructor | NumberConstructor | BooleanConstructor | FunctionConstructor | ArrayConstructor;
export type PropType<T extends Type = Type> = T | [T, Mod, ReturnType<T>?];
export type PropTypes<K extends PropertyKey = string> = Record<K, PropType>;

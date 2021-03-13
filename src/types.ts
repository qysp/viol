import { AyceComponent } from './Component';
import { CssProcessor, HtmlProcessor } from './processors';

export type IsEmpty<T, Y = true, N = false> = T extends { [key: string]: never } ? Y : N;

export type State = Record<string, any>;
export type Props = Record<string, any>;

export type ComponentDef<C extends AyceComponent> = {
  template: Template<C>;
  styles?: Styles<C>;
} & IsEmpty<StateOf<C>, { state?: StateOf<C> }, { state: StateOf<C> }>;

export type PropsOf<C> = C extends AyceComponent<State, infer P> ? P : never;
export type StateOf<C> = C extends AyceComponent<infer S, Props> ? S : never;

export type SubstituteArgs<C extends AyceComponent> = {
  state: StateOf<C>;
  props: PropsOf<C>;
  self: C;
};
export type TemplateFunction<C extends AyceComponent> = (args: SubstituteArgs<C>) => string | HtmlProcessor<C>;
export type StylesFunction<C extends AyceComponent> = (args: SubstituteArgs<C>) => string | CssProcessor<C>;
export type Template<C extends AyceComponent> = string | HtmlProcessor<C> | TemplateFunction<C>;
export type Styles<C extends AyceComponent> = string | CssProcessor<C> | StylesFunction<C>;

export type Substitute =
  | string
  | number
  | boolean;

export type TemplateSubstitute<C extends AyceComponent> =
  | Substitute
  | Substitute[]
  | AyceComponent<any, any>
  | AyceComponent<any, any>[]
  | ((args: SubstituteArgs<C>) => AyceComponent<any, any> | Substitute);

export type StylesSubstitute<C extends AyceComponent> =
  | Substitute
  | C
  | ((args: SubstituteArgs<C>) => C | Substitute);

export interface AlpineComponent<E extends HTMLElement, C extends AyceComponent> {
  $data: C;
  $el: AlpineElement<E, C>;
  membrane: object;
  nextTickStack: (() => void)[];
  pauseReactivity: boolean;
  showDirectiveLastElement?: E;
  showDirectiveStack: (() => void)[];
  unobservedData: C;
  watchers: Record<string, ((value: unknown) => void)[]>;
  updateElement(el: HTMLElement, extraVars?: () => any): void;
  updateElements(rootEl: HTMLElement, extraVars?: () => any): void;
}

export interface AlpineElement<E extends HTMLElement, C extends AyceComponent> {
  __x: AlpineComponent<E, C>;
  __x_original_classes?: string[];
  __x_is_shown?: boolean;
  __x_inserted_me?: boolean;
  __x_for_key?: string;
}

// TODO: expand interface with Alpine's public & private API
export interface Alpine {
  onBeforeComponentInitialized: (callback: (component: AlpineComponent<any, any>) => void) => void;
  onComponentInitialized: (callback: (component: AlpineComponent<any, any>) => void) => void;
}

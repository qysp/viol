import { AlpineComponent } from './Component';
import { CssProcessor, HtmlProcessor } from './processors';

export type IsEmpty<T, Y = true, N = false> = T extends { [key: string]: never } ? Y : N;

export type State = Record<string, any>;
export type Props = Record<string, any>;

export type ComponentDef<C extends AlpineComponent> = {
  template: Template<C>;
  styles?: Styles<C>;
} & IsEmpty<StateOf<C>, { state?: StateOf<C> }, { state: StateOf<C> }>;

export type PropsOf<C> = C extends AlpineComponent<State, infer P> ? P : never;
export type StateOf<C> = C extends AlpineComponent<infer S, Props> ? S : never;

export type SubstituteArgs<C extends AlpineComponent> = {
  state: StateOf<C>;
  props: PropsOf<C>;
  self: C;
};
export type TemplateFunction<C extends AlpineComponent> = (args: SubstituteArgs<C>) => string | HtmlProcessor<C>;
export type StylesFunction<C extends AlpineComponent> = (args: SubstituteArgs<C>) => string | CssProcessor<C>;
export type Template<C extends AlpineComponent> = string | HtmlProcessor<C> | TemplateFunction<C>;
export type Styles<C extends AlpineComponent> = string | CssProcessor<C> | StylesFunction<C>;

export type Substitute =
  | string
  | number
  | boolean;

export type TemplateSubstitute<C extends AlpineComponent> =
  | Substitute
  | Substitute[]
  | AlpineComponent
  | AlpineComponent[]
  | ((args: SubstituteArgs<C>) => AlpineComponent | Substitute);

export type StylesSubstitute<C extends AlpineComponent> =
  | Substitute
  | C
  | ((args: SubstituteArgs<C>) => C | Substitute);

export interface AlpineElement<E extends HTMLElement, C extends AlpineComponent> {
  __x: {
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
  __x_original_classes?: string[];
  __x_is_shown?: boolean;
  __x_inserted_me?: boolean;
  __x_for_key?: string;
}

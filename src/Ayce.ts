import { AlpineComponent } from './Component';
import {
  ComponentDef,
  CreateComponentProps,
  Mod,
  PropType,
  TemplateFunction,
  Type,
} from './types';

export type Substitute<C extends AlpineComponent> =
  | string
  | number
  | boolean
  | AlpineComponent
  | ((options: CreateComponentProps<C>) => AlpineComponent);

export const required = (type: Type): PropType => [type, Mod.Required];
export const withDefault = <T extends Type>(
  type: T,
  defaultValue: ReturnType<T>,
): PropType => [type, Mod.Default, defaultValue];

export function Component<C extends AlpineComponent>(def: ComponentDef<C>): ClassDecorator {
  return (target) => {
    Object.defineProperties(target.prototype, {
      template: { value: def.template },
      state: { value: def.state ?? {}, writable: true },
      propTypes: { value: def.propTypes ?? {} },
    });
  }
}

export const html = <C extends AlpineComponent>(
  strings: TemplateStringsArray,
  ...substitutes: Substitute<C>[]
): TemplateFunction<C> => {
  return (options: CreateComponentProps<C>): string => {
    return [...strings].reduce((html, string, index) => {
      const substitute = substitutes[index];
      if (substitute instanceof AlpineComponent) {
        string += substitute.__getTemplate();
      } else if (typeof substitute === 'function') {
        const component = substitute(options);
        string += component.__getTemplate();
      } else {
        string += substitute;
      }
      return html + string;
    }, '');
  };
};

export const createApp = <C extends AlpineComponent>(component: C, root: HTMLElement) => {
  const alpine: (callback: Function) => void = window.deferLoadingAlpine ?? ((cb) => cb());
  window.deferLoadingAlpine = (callback: Function) => {
    alpine(callback);
    root.innerHTML = component.__getTemplate();
  }
};

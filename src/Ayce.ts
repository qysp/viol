import { AlpineComponent } from './Component';
import {
  ComponentDef,
  TemplateArgs,
  Mod,
  PropType,
  Substitute,
  TemplateFunction,
  Type,
} from './types';

export const required = (type: Type): PropType => [type, Mod.Required];
export const withDefault = <T extends Type>(
  type: T,
  defaultValue: ReturnType<T>,
): PropType<T> => [type, Mod.Default, defaultValue];

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
  return (args: TemplateArgs<C>): string => {
    return [...strings].reduce((html, string, index) => {
      let substitute = substitutes[index];
      if (typeof substitute === 'function') {
        substitute = substitute(args);
      }
      string += substitute instanceof AlpineComponent
        ? substitute.__getTemplate()
        : String(substitute);
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

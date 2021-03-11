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
import { has } from './util';

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
      if (substitute instanceof AlpineComponent) {
        substitute.parent = args.self;
        string += substitute.__getTemplate()
      } else {
        string += String(substitute);
      }
      return html + string;
    }, '');
  };
};

export const getComponent = (name: string): AlpineComponent | null => {
  if (!has(window.AlpineComponents, name)) {
    return null;
  }
  return window.AlpineComponents[name];
}

export const createApp = <C extends AlpineComponent>(component: C, root: HTMLElement) => {
  const alpine: (callback: Function) => void = window.deferLoadingAlpine ?? ((cb) => cb());
  window.deferLoadingAlpine = (callback: Function) => {
    alpine(callback);
    root.innerHTML = component.__getTemplate();
  }
};

import { AlpineComponent } from './Component';
import {
  ComponentDef,
  SubstituteArgs,
  SubstituteFunction,
  TemplateSubstitute,
  StylesSubstitute,
} from './types';
import { has } from './util';
import { templateSymbol } from './constants';

export function Component<C extends AlpineComponent>(def: ComponentDef<C>): ClassDecorator {
  return (target) => {
    Object.defineProperties(target.prototype, {
      template: { value: def.template },
      styles: { value: def.styles },
      state: { value: def.state ?? {}, writable: true },
    });
  }
}

export const html = <C extends AlpineComponent>(
  strings: TemplateStringsArray,
  ...substitutes: TemplateSubstitute<C>[]
): SubstituteFunction<C> => {
  return (args: SubstituteArgs<C>): string => {
    return [...strings].reduce((html, string, index) => {
      let substitute = substitutes[index] ?? '';
      if (typeof substitute === 'function') {
        substitute = substitute(args);
      }
      if (substitute instanceof AlpineComponent) {
        substitute.parent = args.self;
        string += substitute[templateSymbol]()
      } else {
        string += String(substitute);
      }
      return html + string;
    }, '');
  };
};

export const css = <C extends AlpineComponent>(
  strings: TemplateStringsArray,
  ...substitutes: StylesSubstitute<C>[]
): SubstituteFunction<C> => {
  return (args: SubstituteArgs<C>): string => {
    return [...strings].reduce((css, string, index) => {
      let substitute = substitutes[index] ?? '';
      if (typeof substitute === 'function') {
        substitute = substitute(args);
      }
      return css + string + String(substitute);
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
    root.innerHTML = component[templateSymbol]();
  }
};

import { AlpineComponent } from './Component';
import { ComponentDef, StylesSubstitute, TemplateSubstitute } from './types';
import { templateSymbol } from './constants';
import { CssProcessor, HtmlProcessor } from './processors';

export function Component<C extends AlpineComponent>(def: ComponentDef<C>): ClassDecorator {
  return (target) => {
    Object.defineProperties(target.prototype, {
      template: { value: def.template },
      styles: { value: def.styles },
      state: {
        value: def.state ?? {},
        writable: true,
      },
    });
  }
}

export const html = <C extends AlpineComponent>(
  strings: TemplateStringsArray,
  ...substitutes: TemplateSubstitute<C>[]
): HtmlProcessor<C> => {
  return new HtmlProcessor([...strings], substitutes);
};

export const css = <C extends AlpineComponent>(
  strings: TemplateStringsArray,
  ...substitutes: StylesSubstitute<C>[]
): CssProcessor<C> => {
  return new CssProcessor([...strings], substitutes);
};

export const getComponent = (name: string): AlpineComponent | null => {
  return window.AlpineComponents.get(name) ?? null;
}

export const createApp = <C extends AlpineComponent>(component: C, root: HTMLElement) => {
  const alpine: (callback: Function) => void = window.deferLoadingAlpine ?? ((cb) => cb());
  window.deferLoadingAlpine = (callback: Function) => {
    alpine(callback);
    root.innerHTML = component[templateSymbol]();
  }
};

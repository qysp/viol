import { ViolComponent } from './Component';
import { ComponentDef, StylesSubstitute, TemplateSubstitute } from './types';
import { CSSProcessor, HTMLProcessor } from './internal/processors';
import { processComponent } from './internal/components';
import { createElement } from './internal/util';

export function Component<C extends ViolComponent>(def: ComponentDef<C>): ClassDecorator {
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

export const html = <C extends ViolComponent>(
  strings: TemplateStringsArray,
  ...substitutes: TemplateSubstitute<C>[]
): HTMLProcessor<C> => {
  return new HTMLProcessor([...strings], substitutes);
};

export const css = <C extends ViolComponent>(
  strings: TemplateStringsArray,
  ...substitutes: StylesSubstitute<C>[]
): CSSProcessor<C> => {
  return new CSSProcessor([...strings], substitutes);
};

export const getComponent = <C extends ViolComponent = ViolComponent>(name: string): C | null => {
  return window.ViolComponents.get(name) as C ?? null;
}

export const createApp = <C extends ViolComponent>(component: C, root: HTMLElement) => {
  const alpine: (callback: Function) => void = window.deferLoadingAlpine ?? ((cb) => cb());
  window.deferLoadingAlpine = (callback: Function) => {
    alpine(callback);
    // Render components into the root element.
    root.innerHTML = processComponent(component);
    // Concat all styles and append them in the head element.
    const styleSheet = createElement<HTMLStyleElement>('style', window.ViolStyles.join(''));
    document.head.appendChild(styleSheet);
    // Set up onInit listener.
    window.Alpine.onBeforeComponentInitialized((component) => {
      if (typeof component.$data.onInit === 'function') {
        component.$data.onInit();
      }
    });
    // Set up onAfterInit listener.
    window.Alpine.onComponentInitialized((component) => {
      if (typeof component.$data.onAfterInit === 'function') {
        component.$data.onAfterInit();
      }
    });
  }
};

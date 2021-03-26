import { AlpineComponent, AlpineElement } from '../types';

const observedElements = new Set<Node>();
const onDestroyObserver: MutationObserver = new MutationObserver((records) => {
  for (const record of records) {
    for (const node of Array.from(record.removedNodes)) {
      if (observedElements.has(node)) {
        observedElements.delete(node);
      }
      if ('__x' in node) {
        const { __x: component } = node as AlpineElement<any, any>;
        if (typeof component.$data.onDestroy === 'function') {
          component.$data.onDestroy();
        }
      }
    }
  }
});

const UidGenerator = (function* (id: number = 0): Generator<string, void> {
  while (++id) yield (id + Math.random()).toString(36);
})();

export const uid = (): string => UidGenerator.next().value as string;

export const createElement = <R extends HTMLElement = HTMLElement>(tagName: string, innerHTML: string): R => {
  const element = document.createElement(tagName);
  element.innerHTML = innerHTML;
  return element as R;
};

export const createFragment = (html: string): DocumentFragment => {
  const template = createElement<HTMLTemplateElement>('template', html);
  return template.content;
};

export const observeOnDestroy = (component: AlpineComponent<any, any>): void => {
  const parent = component.$el.parentElement;
  // We need to observe the parent element to get notifications
  // when a child node was removed from the DOM.
  if (parent === null || observedElements.has(parent)) {
    return;
  }
  observedElements.add(parent);
  onDestroyObserver.observe(parent, { childList: true });
};

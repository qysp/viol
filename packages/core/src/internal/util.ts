import { AlpineComponent, AlpineElement } from '../types';

const callOnDestroy = (element: AlpineElement<any, any>): void => {
  element.__x.$data.onDestroy?.();
};

const observedElements = new Set<Node>();
const onDestroyObserver: MutationObserver = new MutationObserver((records) => {
  for (const record of records) {
    record.removedNodes.forEach((node) => {
      // Remove node if it was being observed.
      if (observedElements.has(node)) {
        observedElements.delete(node);
      }
      // Ensure node is an element.
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        // Call `onDestroy` hook for node if it's a Viol component.
        if (element.hasAttribute('x-name')) {
          callOnDestroy(element as AlpineElement<any, any>);
        }
        // Iterate all of its child components and call their `onDestroy` hook.
        element.querySelectorAll('[x-name]').forEach((component) => {
          callOnDestroy(component as AlpineElement<any, any>);
        });
      }
    });
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

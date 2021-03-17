const UidGenerator = (function* (id: number = 0): Generator<string, void> {
  while (++id) yield (id + Math.random()).toString(36);
})();

export const uid = (): string => UidGenerator.next().value as string;

export const createElement = <R extends HTMLElement = HTMLElement>(tagName: string, innerHTML: string): R => {
  const element = document.createElement(tagName);
  element.innerHTML = innerHTML;
  return element as R;
}

export const createFragment = (html: string): DocumentFragment => {
  const template = createElement<HTMLTemplateElement>('template', html);
  return template.content;
};

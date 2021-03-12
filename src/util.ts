const UidGenerator = (function* (id: number = 0): Generator<string, void> {
  while (++id) yield (id + Math.random()).toString(36);
})();

export const uid = (): string => UidGenerator.next().value as string;

export const createFragment = (html: string): DocumentFragment => {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content;
};

export const has = <O extends {}, P extends string | number>(
  obj: O,
  prop: P,
): obj is O & Record<P, O[keyof O]> => {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

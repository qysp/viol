const UidGenerator = (function* (id = 0, suffix = Math.random()) {
  while (++id) yield (id + suffix).toString(36);
})();

export const uid = (): string => UidGenerator.next().value as string;

export const createFragment = (html: string) => {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content;
};

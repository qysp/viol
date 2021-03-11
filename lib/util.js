const UidGenerator = (function* (id = 0, suffix = Math.random()) {
    while (++id)
        yield (id + suffix).toString(36);
})();
export const uid = () => UidGenerator.next().value;
export const createFragment = (html) => {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content;
};
export const has = (obj, prop) => {
    return Object.prototype.hasOwnProperty.call(obj, prop);
};

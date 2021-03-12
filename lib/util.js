const UidGenerator = (function* (id = 0) {
    while (++id)
        yield (id + Math.random()).toString(36);
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

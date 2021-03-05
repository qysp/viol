const UidGenerator = (function* (id = 0, suffix = Math.random()) {
    while (++id)
        yield (id + suffix).toString(36);
})();
export const uid = () => UidGenerator.next().value;

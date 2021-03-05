import { Mod } from './types';
export const isValidProp = (propValue, propType) => {
    switch (propType) {
        case String:
            return typeof propValue === 'string';
        case Number:
            return typeof propValue === 'number';
        case Boolean:
            return typeof propValue === 'boolean';
        case Function:
            return typeof propValue === 'function';
        case Array:
            return Array.isArray(propValue);
        default:
            return false;
    }
};
export const validateProps = (props, propTypes) => {
    const p = props ?? {};
    if (propTypes === undefined) {
        return p;
    }
    for (const [prop, propType] of Object.entries(propTypes)) {
        if (!Object.prototype.hasOwnProperty.call(p, prop)) {
            if (Array.isArray(propType)) {
                const [, mod, defaultValue] = propType;
                if (mod === Mod.Required) {
                    throw new TypeError(`Property '${prop}' is required and does not exist`);
                }
                if (mod === Mod.Default) {
                    p[prop] = defaultValue;
                }
            }
        }
        else {
            const type = Array.isArray(propType) ? propType[0] : propType;
            const propValue = p[prop];
            if (!isValidProp(propValue, type)) {
                throw new TypeError(`Expected property '${prop}' to be of type ${type.name}, got ${typeof propValue}`);
            }
        }
    }
    return p;
};

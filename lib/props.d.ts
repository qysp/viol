import { Props, PropTypes, Type } from './types';
export declare const isValidProp: <T extends Type>(propValue: unknown, propType: T) => propValue is ReturnType<T>;
export declare const validateProps: <P extends Props>(props?: P | undefined, propTypes?: PropTypes<string> | undefined) => P;

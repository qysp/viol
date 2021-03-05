import { Props, PropTypes, Type } from './types';
export declare const isValidProp: (propValue: unknown, propType: Type) => boolean;
export declare const validateProps: <P extends Props>(props?: P | undefined, propTypes?: PropTypes | undefined) => P;

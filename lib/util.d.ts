export declare const uid: () => string;
export declare const createFragment: (html: string) => DocumentFragment;
export declare const has: <O extends {}, P extends string | number>(obj: O, prop: P) => obj is O & Record<P, unknown>;

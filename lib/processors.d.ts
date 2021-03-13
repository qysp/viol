import { AlpineComponent } from './Component';
import { StylesSubstitute, SubstituteArgs, TemplateSubstitute } from './types';
export declare abstract class Processor<C extends AlpineComponent> {
    abstract process(args: SubstituteArgs<C>): string;
}
export declare class HtmlProcessor<C extends AlpineComponent> extends Processor<C> {
    private strings;
    private substitutes;
    constructor(strings: string[], substitutes: TemplateSubstitute<C>[]);
    process(args: SubstituteArgs<C>): string;
}
export declare class CssProcessor<C extends AlpineComponent> extends Processor<C> {
    private strings;
    private substitutes;
    constructor(strings: string[], substitutes: StylesSubstitute<C>[]);
    process(args: SubstituteArgs<C>): string;
}

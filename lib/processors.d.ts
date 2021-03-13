import { AyceComponent } from './Component';
import { StylesSubstitute, SubstituteArgs, TemplateSubstitute } from './types';
export declare abstract class Processor<C extends AyceComponent> {
    abstract process(args: SubstituteArgs<C>): string;
}
export declare class HtmlProcessor<C extends AyceComponent> extends Processor<C> {
    private strings;
    private substitutes;
    constructor(strings: string[], substitutes: TemplateSubstitute<C>[]);
    process(args: SubstituteArgs<C>): string;
}
export declare class CssProcessor<C extends AyceComponent> extends Processor<C> {
    private strings;
    private substitutes;
    constructor(strings: string[], substitutes: StylesSubstitute<C>[]);
    process(args: SubstituteArgs<C>): string;
}

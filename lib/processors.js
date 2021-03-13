import { AlpineComponent } from './Component';
import { templateSymbol } from './constants';
export class Processor {
}
export class HtmlProcessor extends Processor {
    constructor(strings, substitutes) {
        super();
        this.strings = strings;
        this.substitutes = substitutes;
    }
    process(args) {
        return this.strings.reduce((html, string, index) => {
            let substitute = this.substitutes[index] ?? '';
            if (typeof substitute === 'function') {
                substitute = substitute(args);
            }
            if (substitute instanceof AlpineComponent) {
                substitute.parent = args.self;
                string += substitute[templateSymbol]();
            }
            else {
                string += String(substitute);
            }
            return html + string;
        }, '');
    }
}
export class CssProcessor extends Processor {
    constructor(strings, substitutes) {
        super();
        this.strings = strings;
        this.substitutes = substitutes;
    }
    process(args) {
        return this.strings.reduce((css, string, index) => {
            let substitute = this.substitutes[index] ?? '';
            if (typeof substitute === 'function') {
                substitute = substitute(args);
            }
            string += substitute instanceof AlpineComponent
                ? substitute.selector
                : String(substitute);
            return css + string;
        }, '');
    }
}

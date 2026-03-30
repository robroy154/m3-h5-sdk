import { inject, Pipe, PipeTransform } from "@angular/core";
import { ILanguage, IWidgetContext } from "@infor-lime/core";

@Pipe({ name: "t", standalone: true })
export class TranslatePipe implements PipeTransform {
	#context = inject(IWidgetContext);
	#lang: ILanguage;

	constructor() {
		this.#lang = this.#context.getLanguage();
	}

	format(text: string, value: string) {
		return this.#lang.format(text, value);
	}

	get(id: string) {
		return this.#lang.get(id) || id;
	}

	transform(text: string, value?: string) {
		const constant = this.get(text);
		return value || value === "" ? this.format(constant, value) : constant;
	}
}

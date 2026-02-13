import { Directive, Input } from "@angular/core";

@Directive()
export abstract class ComponentBase<Model = unknown> {
	@Input() setDefaultValue: boolean;
	@Input() disabled: boolean;
	@Input() autoId: string;

	model: Model;

	get disabledAttr() {
		return this.disabled ? "" : null;
	}
}

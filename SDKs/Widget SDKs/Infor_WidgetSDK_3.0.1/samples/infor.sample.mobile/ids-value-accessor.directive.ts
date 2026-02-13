import { Directive, forwardRef } from "@angular/core";
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
	selector: "ids-radio-group[ngModel]",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => IdsRadioGroupValueAccessorDirective),
			multi: true,
		},
	],
})
export class IdsRadioGroupValueAccessorDirective extends DefaultValueAccessor {}

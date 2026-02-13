import { Directive, forwardRef } from "@angular/core";
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
	selector: "ids-input[ngModel]",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => IdsInputValueAccessorDirective),
			multi: true,
		},
	],
})
export class IdsInputValueAccessorDirective extends DefaultValueAccessor {}

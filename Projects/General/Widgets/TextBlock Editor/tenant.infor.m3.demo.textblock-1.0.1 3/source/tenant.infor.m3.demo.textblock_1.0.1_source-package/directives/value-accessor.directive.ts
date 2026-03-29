import { Directive, forwardRef } from "@angular/core";
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
	selector:
		"ids-input[formControlName], ids-trigger-field[ngModel], ids-textarea[formControlName], ids-dropdown[formControl], ids-dropdown[formControlName],ids-dropdown[ngModel],ids-multiselect[formControlName], soho-dropdown[formControl], soho-dropdown[formControlName],soho-dropdown[ngModel]",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DemoValueAccessorDirective),
			multi: true,
		},
	],
})
export class DemoValueAccessorDirective extends DefaultValueAccessor {}

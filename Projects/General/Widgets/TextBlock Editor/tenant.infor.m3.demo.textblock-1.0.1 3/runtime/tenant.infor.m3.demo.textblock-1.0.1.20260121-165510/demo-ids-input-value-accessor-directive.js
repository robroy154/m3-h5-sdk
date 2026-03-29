System.register(['tslib', '@angular/core', '@angular/forms'], (function (exports) {
	'use strict';
	var __decorate, Directive, forwardRef, NG_VALUE_ACCESSOR, DefaultValueAccessor;
	return {
		setters: [function (module) {
			__decorate = module.__decorate;
		}, function (module) {
			Directive = module.Directive;
			forwardRef = module.forwardRef;
		}, function (module) {
			NG_VALUE_ACCESSOR = module.NG_VALUE_ACCESSOR;
			DefaultValueAccessor = module.DefaultValueAccessor;
		}],
		execute: (function () {

			let DemoIdsInputValueAccessorDirective = exports("DemoIdsInputValueAccessorDirective", class DemoIdsInputValueAccessorDirective extends DefaultValueAccessor {
			});
			exports("DemoIdsInputValueAccessorDirective", DemoIdsInputValueAccessorDirective = __decorate([
			    Directive({
			        selector: "ids-input[ngModel]",
			        standalone: true,
			        providers: [
			            {
			                provide: NG_VALUE_ACCESSOR,
			                useExisting: forwardRef(() => DemoIdsInputValueAccessorDirective),
			                multi: true,
			            },
			        ],
			    })
			], DemoIdsInputValueAccessorDirective));

		})
	};
}));

System.register(['tslib', '@angular/core', '@infor-lime/core'], (function (exports) {
	'use strict';
	var __decorate, __metadata, Pipe, inject, IWidgetContext;
	return {
		setters: [function (module) {
			__decorate = module.__decorate;
			__metadata = module.__metadata;
		}, function (module) {
			Pipe = module.Pipe;
			inject = module.inject;
		}, function (module) {
			IWidgetContext = module.IWidgetContext;
		}],
		execute: (function () {

			let DemoTranslatePipe = exports("DemoTranslatePipe", class DemoTranslatePipe {
			    #context = inject(IWidgetContext);
			    #lang;
			    constructor() {
			        this.#lang = this.#context.getLanguage();
			    }
			    format(text, value) {
			        return this.#lang.format(text, value);
			    }
			    get(id) {
			        return this.#lang.get(id);
			    }
			    transform(text, value) {
			        const constant = this.get(text) || text;
			        return value || value === "" ? this.format(constant, value) : constant;
			    }
			});
			exports("DemoTranslatePipe", DemoTranslatePipe = __decorate([
			    Pipe({ name: "t", standalone: true }),
			    __metadata("design:paramtypes", [])
			], DemoTranslatePipe));

		})
	};
}));

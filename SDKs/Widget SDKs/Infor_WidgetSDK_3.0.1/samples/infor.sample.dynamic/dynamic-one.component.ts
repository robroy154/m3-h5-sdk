import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
@Component({
	template: ` <ids-text type="p">Hello dynamic-<b>one</b></ids-text>`,
	selector: "dynamic-one",
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DynamicOneComponent {}

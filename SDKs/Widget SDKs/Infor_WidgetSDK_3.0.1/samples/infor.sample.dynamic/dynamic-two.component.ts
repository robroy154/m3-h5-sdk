import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
	template: `<ids-text type="p">Hello dynamic-<b>two</b></ids-text> `,
	selector: "dynamic-two",
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DynamicTwoComponent {}

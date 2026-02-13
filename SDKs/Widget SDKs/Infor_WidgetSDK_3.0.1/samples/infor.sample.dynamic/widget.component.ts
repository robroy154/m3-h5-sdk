import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	ComponentRef,
	Type,
	ViewChild,
	ViewContainerRef,
} from "@angular/core";
import { DynamicOneComponent } from "./dynamic-one.component";
import { DynamicTwoComponent } from "./dynamic-two.component";

@Component({
	template: `
		<ids-button appearance="primary" (click)="loadOne()"> Load One </ids-button>
		<ids-button appearance="primary" (click)="loadTwo()"> Load Two </ids-button>
		<ng-container #dynamicHost></ng-container>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WidgetComponent {
	@ViewChild("dynamicHost", { read: ViewContainerRef })
	dynamicHost: ViewContainerRef;

	loadOne() {
		this.load(DynamicOneComponent);
	}

	loadTwo() {
		this.load(DynamicTwoComponent);
	}

	private load<T>(component: Type<T>): ComponentRef<T> {
		this.dynamicHost.clear();
		const ref = this.dynamicHost.createComponent(component);
		return ref;
	}
}

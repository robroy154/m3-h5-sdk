import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from "@angular/core";
import { SohoTooltipModule } from "ids-enterprise-ng";
import { SharedCounterService } from "../services/shared-counter.service";
import { CounterComponent } from "./counter.component";

@Component({
	selector: "shared-counter",
	template: `
		<counter
			#counterComponent
			label="shared-counter"
			[value]="counter.count"
			(plus)="counter.increment()"
			(minus)="counter.decrement()">
		</counter>
		<ids-tooltip
			[target]="counterComponent.elementRef.nativeElement"
			placement="top">
			This counter shares state within the component tree since the service is
			provided in a parent component.
		</ids-tooltip>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [CounterComponent, SohoTooltipModule],
})
export class SharedCounterComponent {
	counter = inject(SharedCounterService);
}

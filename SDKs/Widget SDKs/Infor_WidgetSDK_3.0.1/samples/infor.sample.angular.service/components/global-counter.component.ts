import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from "@angular/core";
import { SohoTooltipModule } from "ids-enterprise-ng";
import { GlobalCounterService } from "../services/global-counter.service";
import { CounterComponent } from "./counter.component";

@Component({
	selector: "global-counter",
	template: `
		<counter
			#counterComponent
			label="global-counter"
			[value]="counter.count"
			(plus)="counter.increment()"
			(minus)="counter.decrement()">
		</counter>
		<ids-tooltip
			[target]="counterComponent.elementRef.nativeElement"
			placement="top">
			This counter shares state with other widget instances since the service is
			provided in 'root'
		</ids-tooltip>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [CounterComponent, SohoTooltipModule],
})
export class GlobalCounterComponent {
	counter = inject(GlobalCounterService);
}

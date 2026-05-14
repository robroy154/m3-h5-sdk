import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from "@angular/core";
import { SohoTooltipModule } from "ids-enterprise-ng";
import { LocalCounterService } from "../services/local-counter.service";
import { CounterComponent } from "./counter.component";

@Component({
	selector: "local-counter",
	template: `
		<counter
			#counterComponent
			label="local-counter"
			[value]="counter.count"
			(plus)="counter.increment()"
			(minus)="counter.decrement()">
		</counter>
		<ids-tooltip
			[target]="counterComponent.elementRef.nativeElement"
			placement="top">
			This counter does not share state since the service is only provided in
			this component
		</ids-tooltip>
	`,
	providers: [LocalCounterService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [CounterComponent, SohoTooltipModule],
})
export class LocalCounterComponent {
	counter = inject(LocalCounterService);
}

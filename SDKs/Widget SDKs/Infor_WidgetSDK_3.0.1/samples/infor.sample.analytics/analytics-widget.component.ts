import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from "@angular/core";
import { IWidgetContext } from "@infor-lime/core";
import { Logger } from "./logger";
import { TrackClickDirective } from "./track-click.directive";

@Component({
	templateUrl: "./analytics-widget.component.html",
	imports: [TrackClickDirective],
	providers: [Logger],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AnalyticsWidgetComponent {
	#context = inject(IWidgetContext);
	#logger = inject(Logger);

	trackTabActivation(name: string) {
		this.#logger.log(`Tracking view: ${name}`);
		this.#context.trackView({ name });
	}
}

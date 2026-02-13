import { Directive, HostListener, Input, inject } from "@angular/core";
import { IWidgetContext, TrackEventType } from "@infor-lime/core";
import { Logger } from "./logger";

/**
 * Tracks whenever an element is clicked.
 *
 * @example ```html
 * 	<!-- Register click events with the name "My Button" -->
 * 	<button trackClick="My Button">My Button</button>
 * ```
 */
@Directive({
	selector: "[trackClick]",
})
export class TrackClickDirective {
	@Input("trackClick") eventName: string;

	#context = inject(IWidgetContext);
	#logger = inject(Logger);

	@HostListener("click")
	click() {
		if (this.eventName?.length) {
			this.#logger.log(`Tracking click: ${this.eventName}`);
			this.#context.trackEvent({
				name: this.eventName,
				type: TrackEventType.Click,
			});
		}
	}
}

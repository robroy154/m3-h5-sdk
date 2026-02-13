import { Directive, HostListener, Input, inject } from "@angular/core";
import { IWidgetContext, TrackEventType } from "lime";

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

	private context = inject(IWidgetContext);

	@HostListener("click")
	click() {
		if (this.eventName?.length) {
			this.context.trackEvent({
				name: this.eventName,
				type: TrackEventType.Click,
			});
		}
	}
}

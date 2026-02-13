import { AsyncPipe } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from "@angular/core";
import { IWidgetContext, IWidgetInstance } from "@infor-lime/core";
import { Observable } from "rxjs";
import { scan, startWith } from "rxjs/operators";

@Component({
	template: `
		<ids-layout-flex
			height="100%"
			align-items="center"
			justify-content="center"
			gap="12">
			<ids-layout-flex-item>
				<ids-counts compact>
					<ids-text counts-value>{{ seconds$ | async }}</ids-text>
					<ids-text count-text>1 Second</ids-text>
				</ids-counts>
			</ids-layout-flex-item>
			<ids-layout-flex-item>
				<ids-counts compact>
					<ids-text counts-value>{{ thirtySeconds$ | async }}</ids-text>
					<ids-text count-text>30 Seconds</ids-text>
				</ids-counts>
			</ids-layout-flex-item>
			<ids-layout-flex-item>
				<ids-counts compact>
					<ids-text counts-value>{{ twoMinutes$ | async }}</ids-text>
					<ids-text count-text>2 Minutes</ids-text>
				</ids-counts>
			</ids-layout-flex-item>
		</ids-layout-flex>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [AsyncPipe],
})
export class IntervalWidgetComponent {
	private widgetContext = inject(IWidgetContext);

	seconds$ = this.createCounter(1_000);
	thirtySeconds$ = this.createCounter(30_000);
	twoMinutes$ = this.createCounter(120_000);

	/**
	 * Create an observable counter for the given period.
	 * NOTE: The counter will only be updated while the widget is active.
	 */
	private createCounter(period: number): Observable<number> {
		return this.widgetContext.interval({ period }).pipe(
			scan((count) => count + 1, 0),
			startWith(0),
		);
	}
}

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: IntervalWidgetComponent,
		},
	};
};

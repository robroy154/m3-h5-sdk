import { CommonModule } from "@angular/common";
import { Component, NgModule } from "@angular/core";
import { IWidgetContext, IWidgetInstance } from "lime";
import { Observable } from "rxjs";
import { scan, startWith } from "rxjs/operators";

@Component({
	template: `
		<article class="instance-count">
			<span class="count azure06">{{ seconds$ | async }}</span>
			<span class="title">1 Second</span>
		</article>
		<article class="instance-count">
			<span class="count azure06">{{ thirtySeconds$ | async }}</span>
			<span class="title">30 Seconds</span>
		</article>
		<article class="instance-count">
			<span class="count azure06">{{ twoMinutes$ | async }}</span>
			<span class="title">2 Minutes</span>
		</article>
	`,
	styles: [
		`
			:host {
				display: flex;
				height: 100%;
				align-items: center;
				justify-content: center;
				text-align: center;
			}
		`,
	],
})
export class IntervalWidgetComponent {
	seconds$ = this.createCounter(1_000);
	thirtySeconds$ = this.createCounter(30_000);
	twoMinutes$ = this.createCounter(120_000);

	constructor(private widgetContext: IWidgetContext) {}

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

@NgModule({
	imports: [CommonModule],
	declarations: [IntervalWidgetComponent],
})
export class IntervalWidgetModule {}

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: IntervalWidgetModule,
			componentType: IntervalWidgetComponent,
		},
	};
};

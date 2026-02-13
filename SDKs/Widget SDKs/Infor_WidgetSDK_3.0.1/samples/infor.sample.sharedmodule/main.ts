import { AsyncPipe } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from "@angular/core";
import { IWidgetContext, WidgetState } from "@infor-lime/core";
import { UserContextService } from "@shared/sample-shared-usercontext";
import { defer, finalize, Observable, switchMap } from "rxjs";

@Component({
	template: `
		<ids-layout-flex direction="column" gap="12">
			<ids-layout-flex-item>
				<ids-text font-size="12" text-align="center">
					User context will be loaded only once and shared among all widgets
					using the specified shared module
				</ids-text>
			</ids-layout-flex-item>

			@if (userContext$ | async; as userContext) {
				<!-- Note: Should really use <ids-data-label> but it doesn't work in 1.15.4 -->
				<ids-layout-flex-item>
					<ids-text label="true">Name</ids-text>
					<ids-text font-weight="semi-bold">{{ userContext.name }}</ids-text>
				</ids-layout-flex-item>

				<ids-layout-flex-item>
					<ids-text label="true">User ID</ids-text>
					<ids-text font-weight="semi-bold">{{ userContext.userId }}</ids-text>
				</ids-layout-flex-item>

				<ids-layout-flex-item>
					<ids-text label="true">Department</ids-text>
					<ids-text font-weight="semi-bold">{{
						userContext.department
					}}</ids-text>
				</ids-layout-flex-item>

				<ids-layout-flex-item>
					<ids-text label="true">Area</ids-text>
					<ids-text font-weight="semi-bold">{{ userContext.area }}</ids-text>
				</ids-layout-flex-item>
			}
		</ids-layout-flex>
	`,
	styles: `
		:host {
			display: block;
			padding-inline: var(--ids-space-sm);
		}
	`,

	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [AsyncPipe],
})
export class SharedModuleSampleOneComponent {
	widgetContext = inject(IWidgetContext);

	userContext$ = this.withBusy(
		inject(UserContextService).getUserContext(this.widgetContext),
	);

	/**
	 * Wraps an Observable with busy state handling.
	 */
	private withBusy<T>(observable: Observable<T>): Observable<T> {
		const setBusyState = () => this.widgetContext.setState(WidgetState.busy);
		const setRunningState = () =>
			this.widgetContext.setState(WidgetState.running);

		return defer(async () => setBusyState()).pipe(
			switchMap(() => observable),
			finalize(() => setRunningState()),
		);
	}
}

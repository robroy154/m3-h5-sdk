import { CommonModule } from "@angular/common";
import { Component, NgModule } from "@angular/core";
import { SohoComponentsModule } from "@infor/sohoxi-angular";
import { ISpotlightData, IWidgetContext, IWidgetInstance } from "lime";
import { concatMap, delay, from, Observable, of, repeat } from "rxjs";

@Component({
	selector: "sample-spotlight",
	template: `
		<ng-container *ngIf="data$ | async as data; else empty">
			<img [src]="data.properties.image" width="100" height="100" />
			<fieldset>
				<legend>
					{{ data.properties.title }}
				</legend>
				<div class="summary-form">
					<div class="field" *ngFor="let field of data.fields">
						<span class="label">{{ field.label }}</span>
						<span class="data">{{ field.value }}</span>
					</div>
				</div>
			</fieldset>
		</ng-container>

		<ng-template #empty>
			<article
				soho-emptymessage
				title="No spotlight data yet"
				icon="icon-empty-no-data"
				color="azure"></article>
		</ng-template>
	`,
	styles: [
		`
			:host {
				display: block;
				padding: 10px;
			}
		`,
	],
})
export class SpotlightWidgetComponent {
	data$: Observable<ISpotlightData>;

	constructor(context: IWidgetContext) {
		this.data$ = context.isDev()
			? this.fakeSpotlightData()
			: context.getSpotlight().data$;
	}

	/**
	 * Create a stream of data that would normally come
	 * by clicking results in the Search UI.
	 *
	 * Instead, a timer is used
	 */
	private fakeSpotlightData(): Observable<ISpotlightData> {
		const data: ISpotlightData[] = [
			{
				metadata: {
					repository: {
						name: "sample-repository",
						displayName: "Sample Repository",
					},
				},
				properties: {
					title: "Sample Data 1",
					image: "https://picsum.photos/100",
				},
				fields: [
					{ label: "Firstname", value: "Bobby" },
					{ label: "Lastname", value: "Tables" },
					{ label: "Title", value: "Software Engineer" },
					{ label: "Age", value: "42" },
				],
			},
			{
				metadata: {
					repository: {
						name: "sample-repository",
						displayName: "Sample Repository",
					},
				},
				properties: {
					title: "Sample Data 2",
					image: "https://picsum.photos/100",
				},
				fields: [
					{ label: "Firstname", value: "Foo" },
					{ label: "Lastname", value: "Bar" },
					{ label: "Title", value: "Consultant" },
					{ label: "Age", value: "23" },
				],
			},
		];
		return from(data).pipe(
			concatMap((x) => of(x).pipe(delay(2000))), // Take one item at a time, with a 2 second delay
			repeat(), // Repeat forever
		);
	}
}

@NgModule({
	imports: [CommonModule, SohoComponentsModule],
	declarations: [SpotlightWidgetComponent],
})
export class SpotlightWidgetModule {}

export function widgetFactory(): IWidgetInstance {
	return {
		angularConfig: {
			componentType: SpotlightWidgetComponent,
			moduleType: SpotlightWidgetModule,
		},
	};
}

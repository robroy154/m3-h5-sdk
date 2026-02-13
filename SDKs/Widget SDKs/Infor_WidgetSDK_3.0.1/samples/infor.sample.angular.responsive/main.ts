import { AsyncPipe } from "@angular/common";
import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	OnInit,
	inject,
} from "@angular/core";
import {
	IWidgetAction,
	IWidgetContext,
	IWidgetInstance,
	IWidgetSize,
	WidgetMessageType,
} from "@infor-lime/core";
import { IdsChartData } from "ids-enterprise-wc/components/ids-axis-chart/ids-axis-chart";
import { Observable } from "rxjs";

@Component({
	template: `
		<div
			class="lm-height-full"
			[class.item-selected]="selectedCustomer"
			[class.single-width]="(size$ | async)?.cols === 1">
			@if (selectedCustomer) {
				<ids-button icon="left-arrow" (click)="selectedCustomer = null">
					<ids-text>Go back</ids-text>
				</ids-button>
			}

			<ids-list-view [class.lm-brd]="selectedCustomer">
				@for (item of items; track $index) {
					<ids-list-view-item (click)="updateChart(item)">
						<ids-text font-size="12" type="h2">{{ item }}</ids-text>
					</ids-list-view-item>
				}
			</ids-list-view>

			@if (selectedCustomer) {
				<ids-bar-chart
					class="chart-wrapper"
					[data]="chartData"
					width="360"
					height="280">
				</ids-bar-chart>
			}
		</div>
	`,
	styles: [
		`
			ids-list-view {
				width: 100%;
				height: 100%;
				float: left;
			}

			.item-selected ids-list-view {
				width: 50%;
				border-right: 1px solid;
			}

			.item-selected.single-width ids-list-view {
				display: none;
			}

			.chart-wrapper {
				width: 50%;
				height: calc(100% - 40px) !important;
				float: left !important;
			}

			.single-width .chart-wrapper {
				width: 100%;
			}
		`,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [AsyncPipe],
})
export class ResponsiveWidgetComponent implements OnInit {
	private widgetContext = inject(IWidgetContext);
	private widgetInstance = inject(IWidgetInstance);

	chartData: IdsChartData[];
	items: string[];
	selectedCustomer: string;
	size$: Observable<IWidgetSize>;
	ngOnInit(): void {
		this.size$ = this.widgetContext.getSize();
		this.items = [
			"Customer A",
			"Customer 2",
			"Customer 12345",
			"Lead customer",
			"Customer prospect",
		];
		this.widgetInstance.actions[0].execute = () => this.showInfo();
	}

	updateChart(customer: string): void {
		this.widgetContext.removeWidgetMessage();
		this.selectedCustomer = customer;
		this.chartData = [
			{
				data: [
					{ name: "2014", value: this.getRandomChartValue() },
					{ name: "2015", value: this.getRandomChartValue() },
					{ name: "2016", value: this.getRandomChartValue() },
					{ name: "2017", value: this.getRandomChartValue() },
				],
			},
		];
	}

	private showInfo(): void {
		this.widgetContext.showWidgetMessage({
			type: WidgetMessageType.Info,
			message: "Select a customer to show chart",
		});
	}

	private getRandomChartValue(): number {
		return Math.floor(Math.random() * 1000000);
	}
}

export const getActions = (): IWidgetAction[] => {
	return [
		{ isPrimary: true, standardIconName: "#icon-info", text: "Information" },
	];
};

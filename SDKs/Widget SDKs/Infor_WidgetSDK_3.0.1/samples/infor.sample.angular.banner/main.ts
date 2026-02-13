import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from "@angular/core";
import { IWidgetContext, IWidgetInstance } from "@infor-lime/core";
import { ChartData, ChartDataDirective } from "./chart-data.directive";

@Component({
	template: `
		@switch (chartType) {
			@case ("area") {
				<ids-area-chart
					[data]="chartData"
					width="inherit"
					height="inherit"></ids-area-chart>
			}
			@case ("bar") {
				<ids-bar-chart
					[data]="chartData"
					horizontal
					width="inherit"
					height="inherit"></ids-bar-chart>
			}
			@case ("column") {
				<ids-bar-chart
					[data]="chartData"
					width="inherit"
					height="inherit"></ids-bar-chart>
			}
			@case ("donut") {
				<ids-pie-chart
					[data]="chartData"
					donut
					width="inherit"
					height="inherit"></ids-pie-chart>
			}
			@default {
				<p>Invalid chart type</p>
			}
		}
	`,
	imports: [ChartDataDirective],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WidgetComponent {
	private widgetContext = inject(IWidgetContext);
	private widgetInstance = inject(IWidgetInstance);

	chartData: ChartData = [
		{
			name: "Industry",
			data: [
				{ name: "Automotive", value: 7 },
				{ name: "Distribution", value: 10 },
				{ name: "Equipment", value: 20 },
				{ name: "Fashion", value: 20 },
				{ name: "Food & Beverage", value: 15 },
				{ name: "Healthcare", value: 10 },
				{ name: "Other", value: 18 },
			],
		},
	];
	chartType: ChartType;

	constructor() {
		this.widgetInstance.settingsSaved = () => this.setChartType();
		this.setChartType();
	}

	private setChartType(): void {
		this.chartType = this.widgetContext
			.getSettings()
			.get<ChartType>("chartType");
	}
}

type ChartType = "area" | "bar" | "column" | "donut";

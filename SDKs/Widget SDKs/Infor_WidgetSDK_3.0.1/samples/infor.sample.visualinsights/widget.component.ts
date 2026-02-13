import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { VisualInsights, VizInsightsChart } from "@birst/infor-visual-insights";

@Component({
	templateUrl: "./widget.component.html",
	styleUrl: "./widget.component.css",
})
export class WidgetComponent implements OnInit {
	@ViewChild("chartContainer", { static: true })
	private chartContainer: ElementRef<HTMLElement>;

	ngOnInit(): void {
		const chart = new VisualInsights(
			this.chartContainer.nativeElement,
			this.getConfig(),
		);
		chart.render();
	}

	private getConfig(): VizInsightsChart {
		// This configuration example is from the Wiki but the syntax does not seem to match the current API
		// It will render a chart as expected though.
		return {
			config: {
				chartMode: "full",
				chartType: "column",
				columns: [
					{
						label: "Sales",
						bucket: "Measure",
						dataType: "number",
					},
					{
						label: "Employee",
						bucket: "Category",
						dataType: "string",
					},
				],
				options: {
					xAxis: {
						xAxisPosition: "bottom",
						title: {
							fontSize: 18,
						},
					},
				},
			},
			dataSet: [
				["100", "Yash"],
				["200", "BC"],
				["150", "Simone"],
				["300", "Yasen"],
				["400", "Paolo"],
				["500", "Stephanie"],
			],
		} as unknown as VizInsightsChart;
	}
}

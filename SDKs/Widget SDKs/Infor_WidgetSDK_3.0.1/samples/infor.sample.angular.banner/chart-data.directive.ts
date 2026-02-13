import { Directive, ElementRef, Input, inject } from "@angular/core";
import type IdsAreaChart from "ids-enterprise-wc/components/ids-area-chart/ids-area-chart";
import type { IdsChartData } from "ids-enterprise-wc/components/ids-axis-chart/ids-axis-chart";
import type IdsBarChart from "ids-enterprise-wc/components/ids-bar-chart/ids-bar-chart";
import type IdsPieChart from "ids-enterprise-wc/components/ids-pie-chart/ids-pie-chart";

/**
 * Since the IDS charts are custom elements, they don't have attributes
 * for setting the data. Instead, you have to set the data property
 * directly on the element. This directive lets you do that declaratively
 * in your template.
 */
@Directive({
	selector: "ids-bar-chart[data], ids-area-chart[data], ids-pie-chart[data]",
})
export class ChartDataDirective {
	#element: ElementRef<ChartComponent> = inject(ElementRef);

	@Input()
	set data(data: ChartData) {
		this.#element.nativeElement.data = data;
	}
}

export type ChartData = IdsChartData[];
type ChartComponent = IdsBarChart | IdsAreaChart | IdsPieChart;

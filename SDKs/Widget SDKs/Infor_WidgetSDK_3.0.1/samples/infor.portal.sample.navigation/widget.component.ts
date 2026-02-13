import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	ElementRef,
	OnInit,
	ViewChild,
	inject,
} from "@angular/core";
import {
	BadgeType,
	IWidgetContext,
	IWidgetInstance,
	WidgetMessageType,
} from "@infor-lime/core";
import type IdsBarChart from "ids-enterprise-wc/components/ids-bar-chart/ids-bar-chart";
import { chartData } from "./mock-data";

@Component({
	templateUrl: "./widget.component.html",
	styleUrl: "./widget.component.css",
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WidgetComponent implements OnInit {
	@ViewChild("barChart", { static: true, read: ElementRef<IdsBarChart> })
	barChart: ElementRef<IdsBarChart>;

	#context = inject(IWidgetContext);
	#instance = inject(IWidgetInstance);
	#navigation = this.#context.getNavigation();
	#settings = this.#context.getSettings();

	ngOnInit() {
		const showAll = this.#settings.get("showAll");

		if (showAll) {
			this.showAll(false);
		} else {
			this.showGreat(false);
		}
		this.initActions(showAll);
		this.barChart.nativeElement.tooltipTemplate = () => "$${value}";
	}

	viewDetails() {
		this.#navigation.navigate({
			title: "Customer details",
		});
	}

	private initActions(showAll: boolean) {
		this.#instance.actions[0].options = [
			{
				text: "All",
				execute: () => this.showAll(),
				isSelected: showAll,
			},
			{
				text: "$10k+",
				execute: () => this.showGreat(),
				isSelected: !showAll,
			},
		];

		this.#instance.actions[1].execute = () =>
			this.#context.showWidgetMessage({
				type: WidgetMessageType.Info,
				message: "'Phone' action was clicked",
			});
		this.#instance.actions[2].execute = () =>
			this.#context.showWidgetMessage({
				type: WidgetMessageType.Info,
				message: "'Star' action was clicked",
			});
	}

	private showAll(save = true) {
		this.barChart.nativeElement.data = chartData;
		this.showBadge(chartData[0].data.length);

		if (save) {
			this.#settings.set("showAll", true);
			this.save();
		}
	}

	private showGreat(save = true) {
		const filtered = [
			{
				data: chartData[0].data.filter((balance) => balance.value > 10000),
			},
		];

		this.barChart.nativeElement.data = filtered;
		this.showBadge(filtered[0].data.length);

		if (save) {
			this.#settings.set("showAll", false);
			this.save();
		}
	}

	private save() {
		if (this.#settings.isSettingEnabled("showAll")) {
			this.#context.save();
		}
	}

	private showBadge(count: number) {
		this.#context.showBadge({
			count: count,
			type: BadgeType.Good,
		});
	}
}

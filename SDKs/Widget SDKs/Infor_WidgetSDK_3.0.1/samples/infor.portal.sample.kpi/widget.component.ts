import {
	Component,
	computed,
	CUSTOM_ELEMENTS_SCHEMA,
	inject,
	signal,
} from "@angular/core";
import { IWidgetContext, IWidgetInstance } from "@infor-lime/core";

/**
 * This widget displays a configurable KPI value, and should demonstrate how to build widgets
 * for the KPI ribbon / top bar of a workspace.
 *
 * To be able to add the widget to the top bar, it must have the manifest property `"target": "top"`.
 * Alternatively, if you have an existing widget and want to enable it for the top bar, you can add "top"
 * to the existing "targets" array in the manifest, e.g `"targets": ["top", "default"]`.
 *
 * The `IWidgetContext.isTop()` method can be used to check if the widget is currently running in the top bar.
 */
@Component({
	templateUrl: "./widget.component.html",
	styleUrl: "./widget.component.css",
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [],
})
export class WidgetComponent {
	settings = watchSettings();

	kpiFormat = computed<Intl.NumberFormatOptions>(() => ({
		style: this.settings().kpiFormat,
		currency: this.settings().currency,
		notation: "compact",
	}));

	trendFormat = computed<Intl.NumberFormatOptions>(() => ({
		style: this.settings().trendFormat,
		currency: this.settings().currency,
		notation: "compact",
	}));
}

function watchSettings() {
	const context = inject(IWidgetContext);
	const instance = inject(IWidgetInstance);

	const sig = signal(context.getSettings<Settings>().getValues(), {
		equal: () => false,
	});
	instance.settingsSaved = () => {
		sig.set(context.getSettings<Settings>().getValues());
	};

	return sig.asReadonly();
}

export type Settings = {
	kpi: number;
	label: string;
	subLabel?: string;
	trend?: number;
	kpiFormat?: Intl.NumberFormatOptionsStyle;
	trendFormat?: Intl.NumberFormatOptionsStyle;
	currency?: "EUR" | "INR" | "SEK" | "USD";
};

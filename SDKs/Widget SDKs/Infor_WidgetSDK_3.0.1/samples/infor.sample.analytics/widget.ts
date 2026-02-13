import { IWidgetInstance } from "@infor-lime/core";
import { AnalyticsWidgetComponent } from "./analytics-widget.component";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: AnalyticsWidgetComponent,
		},
	};
};

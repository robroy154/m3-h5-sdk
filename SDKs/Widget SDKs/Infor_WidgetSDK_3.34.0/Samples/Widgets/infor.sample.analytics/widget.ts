import { IWidgetInstance } from "lime";
import { AnalyticsWidgetComponent } from "./analytics-widget.component";
import { AnalyticsWidgetModule } from "./analytics.widget.module";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: AnalyticsWidgetModule,
			componentType: AnalyticsWidgetComponent,
		},
	};
};

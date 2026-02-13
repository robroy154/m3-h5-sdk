import { IWidgetContext, IWidgetInstance } from "@infor-lime/core";
import { EmptyStateComponent } from "./main";

export const widgetFactory = (context: IWidgetContext): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: EmptyStateComponent,
		},
		isConfigured: () => !!context.getSettings().get<string>("Message"),
	};
};

import { IWidgetInstance } from "@infor-lime/core";
import { EmptyStateComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: EmptyStateComponent,
		},
	};
};

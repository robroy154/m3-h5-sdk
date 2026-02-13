import { IWidgetInstance } from "@infor-lime/core";
import { getActions, ResponsiveWidgetComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		actions: getActions(),
		angularConfig: {
			componentType: ResponsiveWidgetComponent,
		},
	};
};

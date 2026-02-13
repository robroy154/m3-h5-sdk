import { IWidgetInstance } from "@infor-lime/core";
import { WidgetSizeComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: WidgetSizeComponent,
		},
	};
};

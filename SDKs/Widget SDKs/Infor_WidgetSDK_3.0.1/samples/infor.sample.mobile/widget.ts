import { IWidgetInstance } from "@infor-lime/core";
import { MobileWidgetComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: MobileWidgetComponent,
		},
	};
};

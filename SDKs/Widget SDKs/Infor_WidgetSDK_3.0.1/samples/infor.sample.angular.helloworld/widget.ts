import { IWidgetInstance } from "@infor-lime/core";
import { HelloWorldComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: HelloWorldComponent,
		},
	};
};

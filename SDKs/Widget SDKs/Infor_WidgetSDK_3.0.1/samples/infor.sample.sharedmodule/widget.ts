import { IWidgetInstance } from "@infor-lime/core";
import { SharedModuleSampleOneComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: SharedModuleSampleOneComponent,
		},
	};
};

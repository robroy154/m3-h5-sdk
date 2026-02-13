import { IWidgetInstance } from "@infor-lime/core";
import { SharedModuleSampleTwoComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: SharedModuleSampleTwoComponent,
		},
	};
};

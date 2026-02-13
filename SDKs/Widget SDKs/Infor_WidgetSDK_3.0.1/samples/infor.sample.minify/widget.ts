import { IWidgetInstance } from "@infor-lime/core";
import { getActions, MinifySampleComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: MinifySampleComponent,
		},
		actions: getActions(),
	};
};

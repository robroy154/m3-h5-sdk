import { IWidgetInstance } from "@infor-lime/core";
import { W2WSenderComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: W2WSenderComponent,
		},
	};
};

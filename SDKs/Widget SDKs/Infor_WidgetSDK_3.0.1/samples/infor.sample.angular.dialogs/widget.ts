import { IWidgetInstance } from "@infor-lime/core";
import { DialogsComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: DialogsComponent,
		},
	};
};

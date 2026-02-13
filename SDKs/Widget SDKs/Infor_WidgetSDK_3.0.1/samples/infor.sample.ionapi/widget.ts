import { IWidgetInstance } from "@infor-lime/core";
import { IonApiComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: IonApiComponent,
		},
	};
};

import { IWidgetInstance } from "@infor-lime/core";
import { getActions, QuicknoteComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: QuicknoteComponent,
		},
		actions: getActions(),
	};
};

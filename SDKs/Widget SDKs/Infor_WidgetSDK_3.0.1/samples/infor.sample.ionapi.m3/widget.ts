import { IWidgetInstance } from "@infor-lime/core";
import { IonApiM3Component } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: IonApiM3Component,
		},
	};
};

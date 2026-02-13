import { IWidgetInstance } from "lime";
import { IonApiM3Component, IonApiM3Module } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: IonApiM3Module,
			componentType: IonApiM3Component,
		},
	};
};

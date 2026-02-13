import { IWidgetInstance } from "@infor-lime/core";
import { LifecycleComponent } from "./lifecycle.component";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: LifecycleComponent,
		},
		actions: [
			{
				isPrimary: true,
				standardIconName: "#icon-close-cancel",
				text: "Clear log",
			},
		],
	};
};

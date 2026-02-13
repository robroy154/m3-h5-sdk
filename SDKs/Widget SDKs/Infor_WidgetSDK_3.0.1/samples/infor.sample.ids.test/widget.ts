import { IWidgetInstance } from "@infor-lime/core";
import { IDSTestComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: IDSTestComponent,
		},
		actions: [
			{
				isPrimary: true,
				standardIconName: "#icon-cascade-objects",
				text: "Modal",
			},
			{ text: "Modal with default values" },
		],
	};
};

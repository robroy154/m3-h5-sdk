import { IWidgetInstance } from "@infor-lime/core";
import { WidgetComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => ({
	angularConfig: {
		componentType: WidgetComponent,
	},
});

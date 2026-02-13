import { IWidgetInstance } from "@infor-lime/core";
import { WidgetComponent } from "./widget.component";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: WidgetComponent,
		},
	};
};

import { IWidgetInstance } from "@infor-lime/core";
import { WidgetComponent } from "./widget.component";

export function widgetFactory(): IWidgetInstance {
	return {
		webComponentConfig: {
			componentType: WidgetComponent,
		},
	};
}

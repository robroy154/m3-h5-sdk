import { IWidgetInstance } from "@infor-lime/core";
import { WidgetComponent } from "./widget.component";

export function widgetFactory(): IWidgetInstance {
	return {
		angularConfig: {
			componentType: WidgetComponent,
		},
		actions: [
			{
				isPrimary: true,
				standardIconName: "#icon-add",
				text: "Add",
				primaryDisplay: "icon",
			},
			{
				isPrimary: true,
				standardIconName: "#icon-edit",
				text: "Edit",
				primaryDisplay: "icon-text",
			},
		],
	};
}

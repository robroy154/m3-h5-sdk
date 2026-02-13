import { IWidgetInstance } from "@infor-lime/core";
import { WidgetComponent } from "./widget.component";

export function widgetFactory(): IWidgetInstance {
	return {
		angularConfig: {
			componentType: WidgetComponent,
		},
		actions: [
			{
				text: "Filter",
				standardIconName: "#icon-filter",
				isPrimary: true,
				optionsSelectable: true,
			},
			{
				text: "Phone",
				standardIconName: "#icon-phone",
				view: "detail",
			},
			{
				text: "Star",
				standardIconName: "#icon-star-outlined",
				view: "detail",
			},
		],
	};
}

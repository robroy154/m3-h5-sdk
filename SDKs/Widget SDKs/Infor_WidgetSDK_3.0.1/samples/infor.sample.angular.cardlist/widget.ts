import { IWidgetInstance } from "@infor-lime/core";
import { CardListComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: CardListComponent,
		},
	};
};

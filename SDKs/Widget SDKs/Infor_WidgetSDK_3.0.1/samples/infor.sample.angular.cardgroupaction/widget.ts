import { IWidgetInstance } from "@infor-lime/core";
import { CardGroupActionComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: CardGroupActionComponent,
		},
	};
};

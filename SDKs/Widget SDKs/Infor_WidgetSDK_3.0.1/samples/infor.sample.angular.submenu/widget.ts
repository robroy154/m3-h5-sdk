import { IWidgetContext, IWidgetInstance } from "@infor-lime/core";
import { SubmenuComponent, getActions } from "./main";

export const widgetFactory = (context: IWidgetContext): IWidgetInstance => {
	return {
		actions: getActions(context),
		angularConfig: {
			componentType: SubmenuComponent,
		},
	};
};

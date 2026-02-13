import { IWidgetInstance } from "@infor-lime/core";
import { ContentTranslationComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: ContentTranslationComponent,
		},
		actions: [
			{
				isPrimary: true,
				standardIconName: "#icon-add",
			},
		],
	};
};

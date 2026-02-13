import { IWidgetInstance } from "lime";
import { ContentTranslationComponent, ContentTranslationModule } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: ContentTranslationModule,
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

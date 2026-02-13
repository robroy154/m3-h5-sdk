import { IWidgetInstance } from "lime";
import { getActions, MinifySampleComponent, MinifySampleModule } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: MinifySampleModule,
			componentType: MinifySampleComponent,
		},
		actions: getActions(),
	};
};

import { IWidgetInstance } from "lime";
import { W2WSenderComponent, W2WSenderModule } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: W2WSenderModule,
			componentType: W2WSenderComponent,
		},
	};
};

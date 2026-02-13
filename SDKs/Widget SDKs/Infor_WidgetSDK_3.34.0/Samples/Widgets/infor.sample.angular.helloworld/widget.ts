import { IWidgetInstance } from "lime";
import { HelloWorldComponent, HelloWorldModule } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: HelloWorldModule,
			componentType: HelloWorldComponent,
		},
	};
};

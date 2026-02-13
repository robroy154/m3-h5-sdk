import { IWidgetInstance } from "lime";
import { MobileWidgetComponent, MobileWidgetModule } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: MobileWidgetModule,
			componentType: MobileWidgetComponent,
		},
	};
};

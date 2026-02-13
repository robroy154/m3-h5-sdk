import { IWidgetInstance } from "lime";
import {
	getActions,
	ResponsiveWidgetComponent,
	ResponsiveWidgetModule,
} from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		actions: getActions(),
		angularConfig: {
			moduleType: ResponsiveWidgetModule,
			componentType: ResponsiveWidgetComponent,
		},
	};
};

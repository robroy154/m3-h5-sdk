import { IWidgetInstance } from "lime";
import {
	SharedModuleSampleTwoComponent,
	SharedModuleSampleTwoModule,
} from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: SharedModuleSampleTwoModule,
			componentType: SharedModuleSampleTwoComponent,
		},
	};
};

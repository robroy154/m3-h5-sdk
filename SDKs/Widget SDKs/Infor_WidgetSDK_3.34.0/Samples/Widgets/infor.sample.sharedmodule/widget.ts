import { IWidgetInstance } from "lime";
import {
	SharedModuleSampleOneComponent,
	SharedModuleSampleOneModule,
} from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: SharedModuleSampleOneModule,
			componentType: SharedModuleSampleOneComponent,
		},
	};
};

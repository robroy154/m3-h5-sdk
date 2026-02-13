import { IWidgetInstance } from "@infor-lime/core";
import { WorkspaceWidgetComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: WorkspaceWidgetComponent,
		},
	};
};

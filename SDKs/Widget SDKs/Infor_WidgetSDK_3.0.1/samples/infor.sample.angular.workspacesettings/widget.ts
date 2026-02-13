import { IWidgetInstance } from "@infor-lime/core";
import { WorkspaceSettingsComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: WorkspaceSettingsComponent,
		},
	};
};

import { IWidgetInstance } from "lime";
import { WorkspaceWidgetComponent, WorkspaceWidgetModule } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: WorkspaceWidgetModule,
			componentType: WorkspaceWidgetComponent,
		},
	};
};

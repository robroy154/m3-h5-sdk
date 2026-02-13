import { IWidgetInstance } from "lime";
import { EmptyStateComponent, EmptyStateModule } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: EmptyStateModule,
			componentType: EmptyStateComponent,
		},
	};
};

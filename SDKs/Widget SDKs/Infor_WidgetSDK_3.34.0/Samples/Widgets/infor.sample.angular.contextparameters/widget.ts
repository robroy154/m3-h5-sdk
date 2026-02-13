import { IWidgetInstance } from "lime";
import { ContextParametersComponent, ContextParametersModule } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: ContextParametersModule,
			componentType: ContextParametersComponent,
		},
		actions: [
			{
				isPrimary: true,
				standardIconName: "#icon-info",
				text: "Information",
			},
		],
	};
};

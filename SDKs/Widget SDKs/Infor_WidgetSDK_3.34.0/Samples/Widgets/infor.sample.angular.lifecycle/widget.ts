import { IWidgetInstance } from "lime";
import { LifecycleComponent } from "./lifecycle.component";
import { LifecycleModule } from "./lifecycle.module";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: LifecycleModule,
			componentType: LifecycleComponent,
		},
		actions: [
			{
				isPrimary: true,
				standardIconName: "#icon-close-cancel",
				text: "Clear log",
			},
		],
	};
};

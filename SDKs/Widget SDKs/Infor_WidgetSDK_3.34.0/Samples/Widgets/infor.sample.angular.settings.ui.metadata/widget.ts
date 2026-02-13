import { IWidgetInstance } from "lime";
import { WidgetComponent, WidgetModule } from "./main";

export const widgetFactory = (): IWidgetInstance => ({
	angularConfig: {
		moduleType: WidgetModule,
		componentType: WidgetComponent,
	},
});

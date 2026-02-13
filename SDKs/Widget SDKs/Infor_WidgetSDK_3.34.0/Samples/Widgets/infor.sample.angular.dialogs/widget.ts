import { IWidgetInstance } from "lime";
import { DialogsComponent, DialogsModule } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: DialogsModule,
			componentType: DialogsComponent,
		},
	};
};

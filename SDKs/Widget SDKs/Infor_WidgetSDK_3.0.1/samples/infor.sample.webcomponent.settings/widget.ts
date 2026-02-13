import { IWidgetInstance } from "@infor-lime/core";
import { SettingsComponent } from "./settings.component";
import { WidgetComponent } from "./widget.component";

export function widgetFactory(): IWidgetInstance {
	return {
		webComponentConfig: {
			componentType: WidgetComponent,
		},
		widgetSettingsFactory() {
			return {
				webComponentConfig: {
					componentType: SettingsComponent,
				},
			};
		},
	};
}

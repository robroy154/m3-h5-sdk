/* eslint-disable no-console */
import { IWidgetInstance, IWidgetSettings } from "@infor-lime/core";
import { SettingsComponent } from "./components/settings-template/settings-template.component";
import { WidgetComponent } from "./widget.component";

export function widgetFactory(): IWidgetInstance {
	return {
		angularConfig: {
			componentType: WidgetComponent,
		},
		widgetSettingsFactory() {
			return {
				angularConfig: {
					componentType: SettingsComponent,
				},
			};
		},
		isConfigured: (settings: IWidgetSettings) => {
			return (
				(settings.get("FILE") !== "" && settings.get("KFLD") !== "") ||
				settings.get("autoMode")
			);
		},
		/* 		actions: [
			{
				text: "Add",
				standardIconName: "#icon-add",
				isPrimary: true,
				optionsSelectable: false,
				isEnabled: false,
				isVisible: true,
			},
		], */
	};
}

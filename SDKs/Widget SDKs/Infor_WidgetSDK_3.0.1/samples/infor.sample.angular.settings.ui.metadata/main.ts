/**
 * NOTE:
 * A custom settings UI shall only be implemented if settings are dynamic, for instance based on data
 * retrieved from a server and. Or if the settings structure is complicated, and not possible to handle using
 * supported metadata setting types (string, boolean, number, selector). For other cases, use metadata settings
 * handled by the default settings UI.
 */

import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	OnInit,
	inject,
} from "@angular/core";
import { IWidgetContext, IWidgetInstance } from "@infor-lime/core";

import { ITextStyle, SettingKey } from "./core";
import { SettingsComponent } from "./settings";

@Component({
	template: `
		<ids-layout-flex
			class="osp-padding-md"
			align-content="center"
			direction="column"
			gap="10">
			<ids-layout-flex-item class="osp-padding-sm">
				<ids-text>
					This widget shows how to implement a Custom Settings UI using Angular.
					The Settings UI can be used to change the style and color of the text
					shown below.
				</ids-text>
			</ids-layout-flex-item>

			<ids-layout-flex-item align-self="center" class="osp-padding-sm">
				<h1
					[style.color]="textStyle.color"
					[style.fontStyle]="textStyle.fontStyle"
					[style.fontWeight]="textStyle.fontWeight">
					Colored Text
				</h1>
			</ids-layout-flex-item>
		</ids-layout-flex>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WidgetComponent implements OnInit {
	private widgetContext = inject(IWidgetContext);
	private widgetInstance = inject(IWidgetInstance);

	textStyle: ITextStyle = {};

	ngOnInit(): void {
		this.setEventHandlers();
		this.updateText();
	}

	private setEventHandlers(): void {
		this.widgetInstance.restored = () => this.widgetContext.setStandardTitle();
		this.widgetInstance.settingsSaved = () => this.updateText();
		this.widgetInstance.widgetSettingsFactory = () => {
			return {
				angularConfig: {
					componentType: SettingsComponent,
				},
			};
		};
	}

	private updateText(): void {
		const settings = this.widgetContext.getSettings();
		const color = settings.get<string>(SettingKey.Color);
		const textStyle = settings.get<string>(SettingKey.Style).toLowerCase();

		this.textStyle.color = color;

		if (textStyle === "bold") {
			this.textStyle.fontWeight = textStyle;
			this.textStyle.fontStyle = null;
		} else {
			this.textStyle.fontStyle = textStyle;
			this.textStyle.fontWeight = null;
		}
	}
}

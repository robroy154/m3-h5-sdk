import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	Input,
	OnInit,
	ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
	IWidgetSettingsComponent,
	IWidgetSettingsContext,
	IWidgetSettingsInstance,
} from "@infor-lime/core";
import { SettingKey } from "./core";
import { TitleSettingComponent } from "./title-setting";

@Component({
	template: `
		<ids-layout-flex direction="column" justify-content="center">
			<ids-layout-flex-item>
				<infor-sample-setting-title-field
					[widgetSettingsContext]="widgetSettingsContext"
					label="Title">
				</infor-sample-setting-title-field>
			</ids-layout-flex-item>

			@if (textStyleVisible) {
				<ids-layout-flex-item>
					<ids-dropdown
						allowBlank="false"
						[label]="textStyleLabel"
						[value]="textStyle"
						[(ngModel)]="textStyle"
						[disabled]="!textStyleEnabled"
						ngDefaultControl>
						<ids-list-box>
							@for (styleOption of textStyleOptions; track $index) {
								<ids-list-box-option [value]="styleOption">
									{{ styleOption }}
								</ids-list-box-option>
							}
						</ids-list-box>
					</ids-dropdown>
				</ids-layout-flex-item>
			}

			@if (textColorVisible) {
				<ids-layout-flex-item>
					<ids-color-picker
						[label]="textColorLabel"
						[value]="textColor"
						[(ngModel)]="textColor"
						[disabled]="!textColorEnabled"
						ngDefaultControl>
					</ids-color-picker>
				</ids-layout-flex-item>
			}
		</ids-layout-flex>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [TitleSettingComponent, FormsModule],
})
export class SettingsComponent implements IWidgetSettingsComponent, OnInit {
	@Input() widgetSettingsContext: IWidgetSettingsContext;
	@Input() widgetSettingsInstance: IWidgetSettingsInstance;

	@ViewChild(TitleSettingComponent, { static: true })
	titleSettingComponent: TitleSettingComponent;

	textColor: string;
	textColorEnabled: boolean;
	textColorVisible: boolean;
	textColorLabel: string;

	textStyle: string;
	textStyleVisible: boolean;
	textStyleEnabled: boolean;
	textStyleLabel: string;
	textStyleOptions = ["Normal", "Italic", "Bold"];

	ngOnInit(): void {
		this.initSettings();
		this.setSettingsClosingHandler();
	}

	private initSettings(): void {
		const widgetContext = this.widgetSettingsContext.getWidgetContext();
		const settings = widgetContext.getSettings();
		const lang = widgetContext.getLanguage();

		this.textStyle = settings.get<string>(SettingKey.Style);
		this.textStyleVisible = settings.isSettingVisible(SettingKey.Style);
		this.textStyleEnabled = settings.isSettingEnabled(SettingKey.Style);
		this.textStyleLabel = lang.get("textStyleSettingLabel");

		this.textColor = settings.get<string>(SettingKey.Color);
		this.textColorVisible = settings.isSettingVisible(SettingKey.Color);
		this.textColorEnabled = settings.isSettingEnabled(SettingKey.Color);
		this.textColorLabel = lang.get("textColorSettingLabel");
	}

	private setSettingsClosingHandler(): void {
		this.widgetSettingsInstance.closing = (closingArg) => {
			const settings = this.widgetSettingsContext
				.getWidgetContext()
				.getSettings();
			if (closingArg.isSave) {
				if (this.textColorEnabled) {
					settings.set(SettingKey.Color, this.textColor);
				}
				if (this.textStyleEnabled) {
					settings.set(SettingKey.Style, this.textStyle);
				}
				this.titleSettingComponent.save();
			}
		};
	}
}

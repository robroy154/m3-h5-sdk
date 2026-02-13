import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
	IWidgetSettingsComponent,
	IWidgetSettingsContext2,
	IWidgetSettingsInstance2,
} from "lime";
import { SettingKey } from "./core";
import { TitleSettingComponent } from "./title-setting";

@Component({
	template: `
		<infor-sample-setting-title-field
			[widgetSettingsContext]="widgetSettingsContext"
			label="Title">
		</infor-sample-setting-title-field>
		<div class="field" *ngIf="textStyleVisible">
			<label>{{ textStyleLabel }}</label>
			<select
				soho-dropdown
				[(ngModel)]="textStyle"
				[disabled]="!textStyleEnabled"
				noSearch>
				<option
					*ngFor="let styleOption of textStyleOptions"
					[value]="styleOption">
					{{ styleOption }}
				</option>
			</select>
		</div>
		<div class="field" *ngIf="textColorVisible">
			<label>{{ textColorLabel }}</label>
			<input
				soho-colorpicker
				[(ngModel)]="textColor"
				[disabled]="!textColorEnabled" />
		</div>
	`,
})
export class SettingsComponent implements IWidgetSettingsComponent, OnInit {
	@Input() widgetSettingsContext: IWidgetSettingsContext2;
	@Input() widgetSettingsInstance: IWidgetSettingsInstance2;

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

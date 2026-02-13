import {
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	inject,
	OnInit,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
	IWidgetContext,
	IWidgetInstance,
	IWorkspaceSetting,
	IWorkspaceSettingsArg,
	IWorkspaceSettingsConfiguration,
	IWorkspaceSettingsData,
	IWorkspaceSettingsValues,
} from "@infor-lime/core";
import { IdsSelectValueAccessor } from "../utils/formUtils";

@Component({
	template: ` <ids-layout-flex>
		@if (isFruitSettingVisible) {
			<ids-dropdown
				disabled="{{ !isFruitSettingEnabled }}"
				allow-blank="true"
				label="Fruit"
				size="md"
				[(ngModel)]="fruitSetting">
				<ids-list-box>
					<ids-list-box-option value=""></ids-list-box-option>
					@for (option of fruitOptions; track $index) {
						<ids-list-box-option value="{{ option }}">{{
							option
						}}</ids-list-box-option>
					}
				</ids-list-box>
			</ids-dropdown>
		}

		@if (isSodaSettingVisible) {
			<ids-dropdown
				disabled="{{ !isSodaSettingEnabled }}"
				allow-blank="true"
				label="Soda"
				size="md"
				[(ngModel)]="sodaSetting">
				<ids-list-box>
					<ids-list-box-option value=""></ids-list-box-option>
					@for (option of sodaOptions; track $index) {
						<ids-list-box-option value="{{ option }}">{{
							option
						}}</ids-list-box-option>
					}
				</ids-list-box>
			</ids-dropdown>
		}

		@if (isBurgerSettingVisible) {
			<ids-input
				disabled="{{ !isBurgerSettingEnabled }}"
				ngDefaultControl
				allow-blank="true"
				label="Burger"
				size="md"
				[(ngModel)]="burgerSetting">
			</ids-input>
		}
	</ids-layout-flex>`,
	styles: `
		:host {
			display: flex;
			justify-content: start;
			align-items: center;
			height: 100%;

			ids-dropdown,
			ids-input {
				margin: 0 10px;
			}
		}
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [FormsModule, IdsSelectValueAccessor],
})
export class WorkspaceSettingsComponent implements OnInit {
	private widgetContext = inject(IWidgetContext);
	private widgetInstance = inject(IWidgetInstance);

	ngOnInit(): void {
		this.widgetInstance.workspaceSettings = (arg: IWorkspaceSettingsArg) => {
			const type = arg.type;
			const configuration = arg.context.configuration;

			if (type === "init") {
				this.initSettings(configuration);
				return;
			}

			if (type === "apply") {
				return this.applySettings();
			}

			if (type === "reset") {
				return this.resetSettings(configuration);
			}
		};
	}

	workspaceSettings: IWorkspaceSettingsData;
	fruitOptions = ["Apple", "Banana", "Kiwi", "Pineapple"];
	fruitSetting: string;
	isFruitSettingVisible: boolean;
	isFruitSettingEnabled: boolean;

	sodaOptions = ["Coca-Cola", "Pepsi", "Trocadero", "Påskmust"];
	sodaSetting: string;
	isSodaSettingVisible: boolean;
	isSodaSettingEnabled: boolean;

	burgerSetting: string;
	isBurgerSettingVisible: boolean;
	isBurgerSettingEnabled: boolean;

	initSettings(configuration: IWorkspaceSettingsConfiguration) {
		const dataSettings = configuration.data?.settings;
		const settingsRules = configuration.settings;

		this.checkVisibleEnabled(settingsRules);
		this.initOptions(configuration);

		this.updateDropdowns(dataSettings);
	}

	applySettings() {
		this.blankCheck();

		const settingsValues: IWorkspaceSettingsData = {
			settings: {
				fruitSetting: this.fruitSetting,
				sodaSetting: this.sodaSetting,
				burgerSetting: this.burgerSetting,
			},
		};
		return settingsValues;
	}

	resetSettings(
		configuration: IWorkspaceSettingsConfiguration,
	): IWorkspaceSettingsData {
		const data = configuration.data;
		const settingsValues = data.settings;

		this.updateDropdowns(settingsValues);

		return data;
	}

	initOptions(configuration: IWorkspaceSettingsConfiguration) {
		this.fruitOptions = this.fruitOptions.filter((option) => {
			return configuration.isMatch("fruitSetting", option);
		});

		this.sodaOptions = this.sodaOptions.filter((option) => {
			return configuration.isMatch("sodaSetting", option);
		});

		if (
			configuration.isMatch(
				"burgerSetting",
				configuration.data.settings["burgerSetting"],
			)
		) {
			this.burgerSetting = configuration.data.settings["burgerSetting"];
		}
	}

	checkVisibleEnabled(settings: IWorkspaceSetting[]) {
		if (settings) {
			for (const setting of settings) {
				if (setting.name === "fruitSetting") {
					this.isFruitSettingVisible = setting.visible ?? true;
					this.isFruitSettingEnabled = setting.enabled ?? true;
				} else if (setting.name === "sodaSetting") {
					this.isSodaSettingVisible = setting.visible ?? true;
					this.isSodaSettingEnabled = setting.enabled ?? true;
				} else if (setting.name === "burgerSetting") {
					this.isBurgerSettingVisible = setting.visible ?? true;
					this.isBurgerSettingEnabled = setting.enabled ?? true;
				}
			}
		}
	}

	updateDropdowns(dataSettings: IWorkspaceSettingsValues) {
		this.fruitSetting = dataSettings["fruitSetting"] ?? "";
		this.sodaSetting = dataSettings["sodaSetting"] ?? "";
		this.burgerSetting = dataSettings["burgerSetting"] ?? "";
	}

	blankCheck() {
		if (this.fruitSetting === "blank") {
			this.fruitSetting = "";
		}
		if (this.sodaSetting === "blank") {
			this.sodaSetting = "";
		}
		if (this.burgerSetting === "blank") {
			this.burgerSetting = "";
		}
	}
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	AfterViewInit,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	inject,
	Input,
	OnDestroy,
	OnInit,
	signal,
	ViewChild,
} from "@angular/core";
import {
	IWidgetContext,
	IWidgetSettingsComponent,
	IWidgetSettingsContext,
	IWidgetSettingsInstance,
	WidgetState,
} from "@infor-lime/core";
import IdsCheckbox from "ids-enterprise-wc/components/ids-checkbox/ids-checkbox";
import IdsDropdown from "ids-enterprise-wc/components/ids-dropdown/ids-dropdown";
import { IdsDropdownOptions } from "ids-enterprise-wc/components/ids-dropdown/ids-dropdown-common";
import IdsInput from "ids-enterprise-wc/components/ids-input/ids-input";
import { Subscription } from "rxjs";
import { IManifestSettings } from "../../utils";
import { ConfigFormComponent } from "../settings/settings-config-form/config-form.component";
import { TitleSettingComponent } from "../title-setting";
import { SettingsServiceService } from "./settings-data.service";

@Component({
	templateUrl: "./settings-template.component.html",
	styleUrl: "./settings-template.component.css",
	standalone: true,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [TitleSettingComponent, ConfigFormComponent],
	providers: [SettingsServiceService],
})
export class SettingsComponent
	implements IWidgetSettingsComponent, OnInit, AfterViewInit, OnDestroy
{
	@Input() widgetSettingsContext!: IWidgetSettingsContext;
	@Input() widgetSettingsInstance!: IWidgetSettingsInstance;
	@ViewChild(TitleSettingComponent)
	titleSettingComponent?: TitleSettingComponent;

	private subscriptions = new Subscription();

	readonly #context = inject(IWidgetContext);

	instanceId: string = "";

	titleLocked = false;

	$textBlockId!: IdsInput;
	$textBlockLanguage!: IdsDropdown;
	$autoMode!: IdsCheckbox;
	$editEnabled!: IdsCheckbox;
	$deleteEnabled!: IdsCheckbox;
	$compactMode!: IdsCheckbox;

	readonly #instance = inject(IWidgetSettingsInstance);
	readonly #data = inject(SettingsServiceService);

	languageList = signal([]);
	$title!: IdsInput;
	configFormValue: any;

	constructor() {
		this.instanceId = this.#context.getWidgetInstanceId();

		// super();
		// this.attachShadow({ mode: "open" });
		this.#instance.closing = ({ isSave }) => {
			if (isSave) {
				this.#save();
			}
		};
	}

	configFormChanged(value: any) {
		this.configFormValue = value;
	}

	ngOnInit(): void {
		const settings = this.#context.getSettings<IManifestSettings>();
		const settingsMetadata = settings.getMetadata();
	}

	ngAfterViewInit(): void {
		const settings = this.#context.getSettings<IManifestSettings>();

		/* Title */
		/* 				this.$title = document.querySelector<IdsInput>(`#${this.instanceId}title`)!;

		const titleSetting = settings.get(
			"title",
			this.#context.getStandardTitle(),
		);

		this.$title.value = titleSetting ?? ""; */

		/* Text block ID */
		/* 		this.$textBlockId = document.querySelector<IdsInput>(
			"#textBlockId" + this.instanceId,
		)!;

		this.$textBlockId.value = settings.get("textBlockId", ""); */

		this.$textBlockLanguage = document.querySelector<IdsDropdown>(
			`#textBlockLanguage${this.instanceId}`,
		)!;

		/* 		this.$autoMode = document.querySelector<IdsCheckbox>(
			`#autoMode${this.instanceId}`,
		)!; */
		this.$editEnabled = document.querySelector<IdsCheckbox>(
			`#editEnabled${this.instanceId}`,
		)!;
		this.$deleteEnabled = document.querySelector<IdsCheckbox>(
			`#deleteEnabled${this.instanceId}`,
		)!;
		this.$compactMode = document.querySelector<IdsCheckbox>(
			`#compactMode${this.instanceId}`,
		)!;

		// const autoModeSettings = settings.get("autoMode", false);
		const editModeSettings = settings.get("editEnabled", false);
		const deleteModeSettings = settings.get("deleteEnabled", false);
		const compactModeSettings = settings.get("compactMode", false);

		// this.$autoMode.checked = autoModeSettings;
		this.$editEnabled.checked = editModeSettings;
		this.$deleteEnabled.checked = deleteModeSettings;
		this.$compactMode.checked = compactModeSettings;

		this.getMiData();
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
	set isBusy(busy: boolean) {
		this.#context.setState(busy ? WidgetState.busy : WidgetState.running);
	}
	getMiData() {
		this.isBusy = true;
		const sub = this.#data.getMiData().subscribe({
			next: (response: any) => {
				this.isBusy = false;
				const languages: IdsDropdownOptions = response.languages;
				languages.unshift({
					label: "User language",
					value: "user",
					icon: "user-profile",
				});
				// languages.unshift({ label: "", value: "" });
				this.$textBlockLanguage.data = languages;
				const settings = this.#context.getSettings<IManifestSettings>();

				this.$textBlockLanguage.value = settings.get("textBlockLanguage", "");
			},
			error: (error: any) => {
				this.isBusy = false;
			},
		});

		this.subscriptions.add(sub);
	}

	onLock() {
		this.titleLocked = !this.titleLocked;
		this.$title.disabled = this.titleLocked;
		if (this.titleLocked) {
			this.$title.value = this.#context.getStandardTitle();
		}
	}

	#save() {
		const widgetContext = this.widgetSettingsContext?.getWidgetContext();
		const settings = (widgetContext ?? this.#context).getSettings();
		settings.set("textBlockLanguage", this.$textBlockLanguage.value ?? "");

		settings.set("autoMode", this.$autoMode?.checked ?? false);
		settings.set("editEnabled", this.$editEnabled.checked ?? false);
		settings.set("deleteEnabled", this.$deleteEnabled.checked ?? false);
		settings.set("compactMode", this.$compactMode.checked ?? false);

		if (this.configFormValue) {
			Object.keys(this.configFormValue).forEach((key) => {
				settings.set(key, this.configFormValue[key]);
			});
		}

		this.titleSettingComponent?.save();
	}
}

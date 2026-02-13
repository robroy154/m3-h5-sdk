import {
	IWidgetSettingsComponent,
	IWidgetSettingsContext,
	IWidgetSettingsInstance,
} from "@infor-lime/core";
import type IdsButton from "ids-enterprise-wc/components/ids-button/ids-button";
import type IdsInput from "ids-enterprise-wc/components/ids-input/ids-input";
import type IdsRadioGroup from "ids-enterprise-wc/components/ids-radio/ids-radio-group";
import { IManifestLanguage, IManifestSettings, html } from "./utils";

export class SettingsComponent
	extends HTMLElement
	implements IWidgetSettingsComponent
{
	widgetSettingsContext: IWidgetSettingsContext;
	widgetSettingsInstance: IWidgetSettingsInstance;

	#model = {
		title: "",
		titleLocked: false,
		titleUnlockable: false,

		fontSize: "",
		fontSizeDisabled: false,
		fontSizeVisible: false,

		text: "",
		textDisabled: false,
		textVisible: false,
	};

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback(): void {
		this.#initializeModel();
		this.widgetSettingsInstance.closing = ({ isSave }) => {
			if (isSave) {
				this.#save();
			}
		};
		this.#render();
	}

	#render() {
		const context = this.widgetSettingsContext.getWidgetContext();
		const lang = context.getLanguage<IManifestLanguage>();
		const {
			fontSize,
			fontSizeDisabled,
			fontSizeVisible,
			text,
			textDisabled,
			textVisible,
			title,
			titleLocked,
			titleUnlockable,
		} = this.#model;

		this.shadowRoot.innerHTML = html`
			<ids-layout-flex align-items="end" gap="8">
				<ids-layout-flex-item>
					<ids-input
						id="title"
						label="${lang.title}"
						value="${title}"
						readonly="${titleLocked}"
						no-margins>
					</ids-input>
				</ids-layout-flex-item>
				<ids-layout-flex-item>
					<ids-button
						id="lock"
						appearance="icon"
						icon="${titleLocked ? "locked" : "unlocked"}"
						disabled="${!titleUnlockable}">
					</ids-button>
				</ids-layout-flex-item>
			</ids-layout-flex>

			<ids-input
				id="text"
				label="${lang.text}"
				value="${text}"
				disabled="${textDisabled}"
				class="${textVisible ? "" : "hidden"}">
			</ids-input>

			<ids-radio-group
				id="fontSize"
				label="${lang.fontSize}"
				value="${fontSize}"
				disabled="${fontSizeDisabled}"
				class="${fontSizeVisible ? "" : "hidden"}">
				<ids-radio value="12" label="${lang.small}"></ids-radio>
				<ids-radio value="16" label="${lang.normal}"></ids-radio>
				<ids-radio value="20" label="${lang.large}"></ids-radio>
			</ids-radio-group>

			<style>
				.hidden {
					display: none;
				}

				ids-layout-flex {
					margin-block-end: var(--ids-space-sm); /* Same as ids-input */
				}
			</style>
		`;

		const titleInput = this.shadowRoot.getElementById("title") as IdsInput;
		titleInput.addEventListener("change", () => {
			this.#model.title = titleInput.value;
		});

		const lockButton = this.shadowRoot.getElementById("lock") as IdsButton;
		lockButton.addEventListener("click", () => {
			this.#model.titleLocked = !this.#model.titleLocked;
			if (this.#model.titleLocked) {
				this.#model.title = context.getStandardTitle();
			}
			this.#render(); // Re-render to update the lock icon
		});

		const textInput = this.shadowRoot.getElementById("text") as IdsInput;
		textInput.addEventListener("change", () => {
			this.#model.text = textInput.value;
		});

		const fontSizeRadio = this.shadowRoot.getElementById(
			"fontSize",
		) as IdsRadioGroup;
		fontSizeRadio.addEventListener("change", () => {
			this.#model.fontSize = fontSizeRadio.value;
		});
	}

	#initializeModel() {
		const context = this.widgetSettingsContext.getWidgetContext();
		const settings = this.widgetSettingsContext
			.getWidgetContext()
			.getSettings<IManifestSettings>();

		this.#model = {
			fontSize: settings.get("fontSize"),
			fontSizeDisabled: !settings.isSettingEnabled("fontSize"),
			fontSizeVisible: settings.isSettingVisible("fontSize"),
			text: settings.get("text"),
			textDisabled: !settings.isSettingEnabled("text"),
			textVisible: settings.isSettingVisible("text"),
			title: context.getTitle(),
			titleLocked: context.isTitleLocked(),
			titleUnlockable: context.isTitleUnlockable(),
		};
	}

	#save() {
		const context = this.widgetSettingsContext.getWidgetContext();
		const settings = context.getSettings<IManifestSettings>();

		context.setTitle(this.#model.title);
		context.setTitleLocked(this.#model.titleLocked);

		settings.set("fontSize", this.#model.fontSize);
		settings.set("text", this.#model.text);
	}
}

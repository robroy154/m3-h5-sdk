import {
	ILanguage,
	IWidgetContext,
	IWidgetInstance,
	IWidgetSettingsCloseArg,
	IWidgetSettingsContext,
	IWidgetSettingsInstance,
} from "@infor-lime/core";
import type IdsColorPicker from "ids-enterprise-wc/components/ids-color-picker/ids-color-picker";
import type IdsIcon from "ids-enterprise-wc/components/ids-icon/ids-icon";

interface IMyLanguage extends ILanguage {
	color: string;
}

/**
 * Custom settings sample widget.
 *
 * The widget shows a large icon with a color that can be changed in settings.
 * The widget uses a custom settings UI with a color picker for changing the icon color.
 */
class SettingsSample implements IWidgetInstance {
	private defaultColor = "#13a7fe";
	private icon: IdsIcon;
	private picker?: IdsColorPicker;
	private language: IMyLanguage;

	constructor(private widgetContext: IWidgetContext) {
		// Get the language object from the widget context.
		this.language = widgetContext.getLanguage<IMyLanguage>();

		// Create the widget content and add it to the parent element from the widget context.
		this.icon = this.createContent();

		this.updateColor();
	}

	/**
	 * Custom settings UI factory function.
	 */
	widgetSettingsFactory(
		settingsContext: IWidgetSettingsContext,
	): IWidgetSettingsInstance {
		this.picker = this.addSettingsContent(settingsContext);

		const instance: IWidgetSettingsInstance = {
			closing: (arg: IWidgetSettingsCloseArg): void => {
				if (arg.isSave) {
					this.onSettingsSaved();
				}
			},
		};
		return instance;
	}

	/**
	 * Gets the icon color from settings.
	 * @returns The color from the widget settings or a default color.
	 */
	private getColor(): string {
		const color = this.widgetContext.getSettings().get<string>("color");
		return color || this.defaultColor;
	}

	/**
	 * Updates the color of the SVG icon.
	 */
	private updateColor() {
		this.icon.setAttribute("color", this.getColor());
	}

	/**
	 * Saves the color setting value and updates the content with the new color.
	 */
	private onSettingsSaved(): void {
		const color = this.picker!.value;
		this.widgetContext.getSettings().set("color", color);
		this.updateColor();
	}

	/**
	 * Adds the settings content.
	 * @returns The color picker element.
	 */
	private addSettingsContent(
		settingsContext: IWidgetSettingsContext,
	): IdsColorPicker {
		const picker = document.createElement("ids-color-picker");
		picker.setAttribute("label", this.language.color);
		picker.setAttribute("value", this.getColor());
		picker.setAttribute("suppress-labels", "true");
		picker.setAttribute("suppress-tooltips", "true");

		// Add the picker to the settings element
		settingsContext.getElement().get(0)!.appendChild(picker);

		return picker;
	}

	/**
	 * Creates an SVG element with a large time picker icon.
	 * @returns The icon element
	 */
	private createContent(): IdsIcon {
		const flexLayout = document.createElement("ids-layout-flex");
		flexLayout.setAttribute("justify-content", "center");
		flexLayout.setAttribute("align-items", "center");
		flexLayout.setAttribute("height", "100%");
		this.widgetContext.getElement().get(0)!.appendChild(flexLayout);

		const flexItem = document.createElement("ids-layout-flex-item");
		flexLayout.appendChild(flexItem);

		const icon = document.createElement("ids-icon");
		icon.setAttribute("icon", "clock");
		icon.setAttribute("size", "xxl");
		flexItem.appendChild(icon);

		return icon;
	}
}

// Widget factory function
export const widgetFactory = (context: IWidgetContext): IWidgetInstance => {
	// Create and return the widget instance
	return new SettingsSample(context);
};

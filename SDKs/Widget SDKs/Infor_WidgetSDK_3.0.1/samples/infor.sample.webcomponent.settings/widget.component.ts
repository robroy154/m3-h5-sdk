import {
	IWidgetComponent,
	IWidgetContext,
	IWidgetInstance,
} from "@infor-lime/core";
import { IManifestSettings, html } from "./utils";

export class WidgetComponent extends HTMLElement implements IWidgetComponent {
	widgetContext: IWidgetContext;
	widgetInstance: IWidgetInstance;

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	render() {
		const settings = this.widgetContext.getSettings<IManifestSettings>();

		const fontSize = settings.get("fontSize");
		const text = settings.get("text", "Hello, world!");

		this.shadowRoot.innerHTML = html`
			<ids-text font-size="${fontSize}">${text}</ids-text>

			<style>
				:host {
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			</style>
		`;
	}

	connectedCallback(): void {
		this.render();

		this.widgetInstance.settingsSaved = () => {
			this.render();
		};
	}
}

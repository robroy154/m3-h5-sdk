import {
	IWidgetComponent,
	IWidgetContext,
	IWidgetInstance,
} from "@infor-lime/core";
import type IdsModal from "ids-enterprise-wc/components/ids-modal/ids-modal";
import { LitElement, css, html } from "lit";
import { query, state } from "lit/decorators.js";

export class WidgetComponent extends LitElement implements IWidgetComponent {
	widgetContext: IWidgetContext;
	widgetInstance: IWidgetInstance;

	@state()
	title: string;

	@query("ids-modal")
	modal: IdsModal;

	static styles = css`
		:host {
			display: block;
			padding: var(--ids-space-sm);
		}
	`;

	render() {
		const widgetId = this.widgetContext.getStandardWidgetId();
		const title = this.title;

		return html`
			<ids-data-label label="Widget ID" label-position="left">
				${widgetId}
			</ids-data-label>
			<ids-data-label label="Title" label-position="left">
				${title}
			</ids-data-label>

			<ids-button appearance="secondary" @click="${this.#openModal}">
				Open Modal
			</ids-button>

			<ids-modal>
				<ids-text slot="title" type="h2" font-size="24">Hello, modal!</ids-text>

				<ids-text>Click anywhere outside this modal to close it</ids-text>
			</ids-modal>
		`;
	}

	connectedCallback(): void {
		super.connectedCallback();
		this.title = this.widgetContext.getTitle();
		this.widgetInstance.settingsSaved = () => {
			this.title = this.widgetContext.getTitle();
		};
	}

	#openModal() {
		this.modal.show();
	}
}

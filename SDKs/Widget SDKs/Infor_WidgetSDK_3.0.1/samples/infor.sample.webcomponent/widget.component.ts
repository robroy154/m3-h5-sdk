import type IdsButton from "ids-enterprise-wc/components/ids-button/ids-button";
import type IdsModal from "ids-enterprise-wc/components/ids-modal/ids-modal";
import {
	WidgetWebComponent,
	css,
	html,
	query,
	state,
} from "./tiny-webcomponent-framework";

/**
 * This sample demonstrates how to create a widget Web Component
 * without any external dependencies.
 *
 * It provides its own small framework which should serve as inspiration
 * for how to build web components in a more declarative style.
 */
export class WidgetComponent extends WidgetWebComponent {
	static styles = css`
		:host {
			display: block;
			min-height: 100%;
			padding: var(--ids-space-sm);
		}
	`;

	@query("ids-modal") modal: IdsModal;
	@query("#open-modal") openModalButton: IdsButton;
	@query("#count") incrementButton: IdsButton;

	@state() count: number;

	beforeFirstRender(): void {
		this.count = 0;
	}

	override render() {
		return html`
			<ids-data-label label="Widget ID" label-position="left">
				${this.widgetContext.getStandardWidgetId()}
			</ids-data-label>
			<ids-button id="open-modal" appearance="secondary">
				Open Modal
			</ids-button>
			<ids-button id="count" appearance="primary">
				<span>Count: ${this.count}</span>
			</ids-button>

			<ids-modal>
				<ids-text slot="title" type="h2" font-size="24">Hello, modal!</ids-text>

				<ids-text>Click anywhere outside this modal to close it</ids-text>
			</ids-modal>
		`;
	}

	afterRender(): void {
		this.openModalButton.addEventListener("click", () => {
			this.modal.show();
		});

		this.incrementButton.addEventListener("click", () => {
			this.count++;
		});
	}
}

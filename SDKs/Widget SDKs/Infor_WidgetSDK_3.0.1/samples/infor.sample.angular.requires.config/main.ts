import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	inject,
	signal,
} from "@angular/core";
import { IWidgetContext, IWidgetInstance } from "@infor-lime/core";

@Component({
	template: `
		<ids-layout-flex
			justify-content="center"
			align-items="center"
			height="100%">
			<ids-text font-size="32">
				{{ message() }}
			</ids-text>
		</ids-layout-flex>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

/**
 * Empty State configuration (icon, titleId, descriptionId, buttonId) is set in the widget manifest.
 * Possible icon choices: "generic", "error-loading", "new-project", "no-alerts", "no-analytics", "no-budget",
 * "no-data", "no-events", "no-notes", "no-orders", "no-tasks"
 */
export class EmptyStateComponent {
	private widgetContext = inject(IWidgetContext);
	private widgetInstance = inject(IWidgetInstance);

	message = signal("");

	constructor() {
		// Subscribe to the event that is triggered when settings are saved to be able to update the message text
		this.widgetInstance.settingsSaved = () => {
			this.updateContent();
		};

		// Initial update of the message text
		this.updateContent();

		/*
			The optional function
			emptyConfigClicked? () => void;
			can be used to override the default behaviour of the empty state button, which is to open the Settings Dialog.
			Code example:
			----------------------------------------------------
			this.widgetInstance.emptyConfigClicked = () => {
				// custom behaviour
			}
			----------------------------------------------------
		*/
	}

	private updateContent() {
		this.message.set(this.widgetContext.getSettings().get<string>("Message"));
	}
}

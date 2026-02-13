import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	OnInit,
	ViewContainerRef,
	inject,
} from "@angular/core";
import {
	IFindWidgetOptions,
	IWidgetAction,
	IWidgetContext,
	IWidgetInstance,
	IWidgetInstanceInfo,
	Log,
	WidgetMessageType,
} from "@infor-lime/core";
import { SohoModalDialogService } from "ids-enterprise-ng";
import { SearchDialogComponent } from "./search-dialog.component";

@Component({
	template: `
		<ids-list-view>
			@for (widget of widgets; track widget.instanceId) {
				<ids-list-view-item>
					<ids-text font-weight="semi-bold">{{ widget.title }}</ids-text>
					<ids-data-label label="Instance ID" label-position="left">
						{{ widget.instanceId }}
					</ids-data-label>
					<ids-data-label label="ID" label-position="left">
						{{ widget.id }}
					</ids-data-label>
					<ids-data-label label="Standard ID" label-position="left">
						{{ widget.standardWidgetId }}
					</ids-data-label>
				</ids-list-view-item>
			}
		</ids-list-view>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FindWidgetsComponent implements OnInit {
	private dialogService = inject(SohoModalDialogService);
	private view = inject(ViewContainerRef);
	private widgetContext = inject(IWidgetContext);
	private widgetInstance = inject(IWidgetInstance);

	widgets: IWidgetInstanceInfo[];

	private language = this.widgetContext.getLanguage();
	private logPrefix = "[FindWidgetsComponent] ";

	ngOnInit(): void {
		this.addSearchActionExecute();
		// Subscribe to the event that is triggered when settings are saved to be able to update the widget list
		this.widgetInstance.settingsSaved = () => {
			this.updateContent();
		};

		// Initial update of the widget list
		this.updateContent();
	}

	private addSearchActionExecute(): void {
		// Add the 'execute' method to the Search action object
		const searchAction = this.widgetInstance.actions[0];
		const executableAction: IWidgetAction = {
			execute: () => {
				this.openSearchDialog();
			},
		};
		Object.assign(searchAction, executableAction);
	}

	private findWidgets(includeSelf: boolean): void {
		Log.debug(
			`${this.logPrefix} Finding widgets with the following options: includeSelf=${includeSelf}`,
		);

		// Find the widgets that are part of the same page as this widget
		this.widgets = this.widgetContext.findWidgetsOnPage({
			includeSelf: includeSelf,
		});
	}

	private openSearchDialog(): void {
		Log.debug(`${this.logPrefix} Opening search dialog`);
		const dialog = this.dialogService.modal(SearchDialogComponent, this.view);
		// Set a localized title
		dialog.title(this.language.get("searchWidgetTitle"));
		// Handle the results when the dialog is closed with OK/Cancel
		dialog.afterClose((result?: string) => {
			if (result) {
				Log.debug(
					`${this.logPrefix} SearchDialog closed with result: ${result}`,
				);
				this.showWidgetMessageWithResult(result);
			} else {
				Log.debug(`${this.logPrefix} SearchDialog was canceled,`);
			}
		});
		// Add the OK and cancel buttons, and define click handlers
		dialog.buttons([
			{
				click: () => dialog.close(),
				text: this.language.cancel,
			},
			{
				click: () => dialog.close(dialog.componentDialog.query),
				isDefault: true,
				text: this.language.ok,
			},
		]);
		// Set the inputs to the SearchDialogComponent
		dialog.apply((component) => {
			component.searchLabel = this.language.get("searchWidgetText");
		});
		dialog.open();
	}

	private showWidgetMessageWithResult(query: string): void {
		// Check if there is one or more widgets with an ID that matches the query entered in dialog.
		// With the options below we will search using all the three IDs for a widget so there can be
		// multiple matches. Note that for a standard widget the id and standardWidgetId will have
		// the same value (compared to a published widget where the id is a GUID).
		const options: IFindWidgetOptions = {
			id: query,
			includeSelf: this.isIncludeSelf(),
			instanceId: query,
			standardWidgetId: query,
		};
		// Show a dismissable result message inside the widget container
		const foundWidget = this.widgetContext.isWidgetOnPage(options);
		const foundWidgetMessage = `Widget found! (${query})`;
		const widgetNotFoundMessage = `Widget not found! (${query})`;
		this.widgetContext.showWidgetMessage({
			message: foundWidget ? foundWidgetMessage : widgetNotFoundMessage,
			type: foundWidget ? WidgetMessageType.Info : WidgetMessageType.Alert,
		});
	}

	private isIncludeSelf(): boolean {
		return this.widgetContext.getSettings().get<boolean>("IncludeSelf");
	}

	private updateContent() {
		this.findWidgets(this.isIncludeSelf());
	}
}

export const getActions = (context: IWidgetContext): IWidgetAction[] => {
	const language = context.getLanguage();
	return [
		{
			isPrimary: true,
			standardIconName: "#icon-search",
			text: language.get("searchWidgetTitle"),
		},
	];
};

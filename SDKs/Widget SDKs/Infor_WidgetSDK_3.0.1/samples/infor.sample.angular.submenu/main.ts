import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	OnInit,
	inject,
} from "@angular/core";
import {
	DialogService,
	ILanguage,
	IWidgetAction,
	IWidgetContext,
	IWidgetInstance,
	Log,
} from "@infor-lime/core";

interface IMyLanguage extends ILanguage {
	widgetText?: string;
}

@Component({
	template: `
		<ids-layout-grid margin="sm">
			<ids-text type="p">{{ language.widgetText }}</ids-text>
		</ids-layout-grid>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SubmenuComponent implements OnInit {
	private dialogService = inject(DialogService);
	private widgetContext = inject(IWidgetContext);
	private widgetInstance = inject(IWidgetInstance);

	language = this.widgetContext.getLanguage<IMyLanguage>();

	ngOnInit() {
		// Hook up execute handlers for the toast and log actions
		this.widgetInstance.actions[0].submenuItems[0].execute = () => {
			this.showToastMessage();
		};
		this.widgetInstance.actions[0].submenuItems[2].execute = () => {
			this.logMessage();
		};
	}

	showToastMessage() {
		this.dialogService.showToast({
			title: "A sample title",
			message: "A dismissable sample toast message",
		});
	}

	logMessage() {
		Log.debug("[SubmenuComponent] Log sample message.");
	}
}

export const getActions = (context: IWidgetContext): IWidgetAction[] => {
	const language = context.getLanguage();
	return [
		{
			isSubmenu: true,
			text: language.get("submenu"),
			submenuItems: [
				{ text: language.get("toastMessage") },
				{ isSeparator: true },
				{ text: language.get("logMessage") },
				{ text: language.get("disabledAction"), isEnabled: false },
			],
		},
	];
};

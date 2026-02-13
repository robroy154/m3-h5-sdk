import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	OnInit,
	inject,
} from "@angular/core";
import { IWidgetContext, IWidgetInstance } from "@infor-lime/core";

@Component({
	template: `<ids-text [attr.font-size]="fontSize">{{ message }}</ids-text>`,
	styles: `
		:host {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
		}
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HelloWorldComponent implements OnInit {
	private widgetContext = inject(IWidgetContext);
	private widgetInstance = inject(IWidgetInstance);

	message: string;
	fontSize: string;

	ngOnInit() {
		// Subscribe to the event that is triggered when settings are saved to be able to update the message text
		this.widgetInstance.settingsSaved = () => {
			this.updateContent();
		};

		// Initial update of the message text and color
		this.updateContent();
	}

	private getFontSize(): FontSizeClass {
		const textSize = this.widgetContext.getSettings().get<string>("TextSize");
		switch (textSize) {
			case "small":
				return "14";
			case "medium":
				return "16";
			case "large":
				return "20";
			case "extraLarge":
				return "24";
			default:
				return "16";
		}
	}

	private updateContent() {
		this.message = this.widgetContext.getSettings().get<string>("Message");
		this.fontSize = this.getFontSize();
	}
}

type FontSizeClass = "14" | "16" | "20" | "24";

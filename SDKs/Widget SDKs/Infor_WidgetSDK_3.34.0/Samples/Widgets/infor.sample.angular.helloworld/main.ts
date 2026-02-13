import { CommonModule } from "@angular/common";
import { Component, Input, NgModule, OnInit } from "@angular/core";
import { IWidgetComponent, IWidgetContext, IWidgetInstance } from "lime";

@Component({
	template: `
		<p [ngClass]="fontSizeClass">
			{{ message }}
		</p>
	`,
	styles: [
		`
			:host {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100%;
			}
		`,
	],
})
export class HelloWorldComponent implements OnInit, IWidgetComponent {
	@Input() widgetContext: IWidgetContext;
	@Input() widgetInstance: IWidgetInstance;

	message: string;
	fontSizeClass: string;

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
				return "text-small";
			case "medium":
				return "text-base";
			case "large":
				return "text-secondary";
			case "extraLarge":
				return "text-primary";
			default:
				return "text-base";
		}
	}

	private updateContent() {
		this.message = this.widgetContext.getSettings().get<string>("Message");
		this.fontSizeClass = this.getFontSize();
	}
}

@NgModule({
	imports: [CommonModule],
	declarations: [HelloWorldComponent],
})
export class HelloWorldModule {}

type FontSizeClass =
	| "text-small"
	| "text-base"
	| "text-secondary"
	| "text-primary";

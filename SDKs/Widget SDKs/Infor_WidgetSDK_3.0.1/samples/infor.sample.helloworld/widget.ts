import { IWidgetContext, IWidgetInstance } from "@infor-lime/core";

class HelloWorld implements IWidgetInstance {
	private readonly messageElement = document.createElement("ids-text");

	constructor(private widgetContext: IWidgetContext) {
		// Add content to the widget element
		this.addContent();

		// Initial update of the message text
		this.updateMessage();
	}

	settingsSaved() {
		this.updateMessage();
	}

	private addContent() {
		this.messageElement.setAttribute("type", "h1");
		this.messageElement.setAttribute("font-size", "32");
		this.messageElement.setAttribute("text-align", "center");

		this.widgetContext.getElement().get(0)!.appendChild(this.messageElement);
	}

	private updateMessage() {
		const message = this.widgetContext.getSettings().get<string>("Message");
		this.messageElement.textContent = message;
	}
}

// Widget factory function
export const widgetFactory = (context: IWidgetContext): IWidgetInstance => {
	// Create and return the widget instance
	return new HelloWorld(context);
};

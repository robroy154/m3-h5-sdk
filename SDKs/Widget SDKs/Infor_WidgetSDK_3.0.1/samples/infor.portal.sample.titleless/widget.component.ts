import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from "@angular/core";
import { IWidgetContext } from "@infor-lime/core";

@Component({
	templateUrl: "./widget.component.html",
	styleUrl: "./widget.component.css",
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WidgetComponent {
	#context = inject(IWidgetContext);

	title = this.#context.getTitle();
}

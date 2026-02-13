import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	OnInit,
	inject,
} from "@angular/core";
import { IWidgetContext } from "@infor-lime/core";

@Component({
	templateUrl: "./widget.component.html",
	styleUrl: "./widget.component.css",
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WidgetComponent implements OnInit {
	#context = inject(IWidgetContext);

	ngOnInit() {
		this.#context.setSubTitle("It also has a subtitle");
	}
}

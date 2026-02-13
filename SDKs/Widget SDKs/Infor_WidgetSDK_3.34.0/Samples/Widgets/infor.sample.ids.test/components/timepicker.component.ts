import { Component, OnInit } from "@angular/core";
import { ComponentBase } from "./base.component";

@Component({
	selector: "ids-timepicker",
	template: ` <div class="field">
		<label soho-label [attr.data-lmw-id]="autoId + '-label'">
			Timepicker
			<br />
			ngModel: {{ model }}
		</label>
		<input
			soho-timepicker
			timeFormat="HH:mm:ss"
			placeholder="HH:mm:ss"
			[(ngModel)]="model"
			data-validate="required"
			[disabled]="disabled"
			[attributes]="{ name: 'data-lmw-id', value: autoId }" />
	</div>`,
})
export class TimepickerComponent extends ComponentBase implements OnInit {
	ngOnInit() {
		this.model = this.setDefaultValue ? "15:30:00" : undefined;
	}
}

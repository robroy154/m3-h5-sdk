import { Component, Input, OnInit } from "@angular/core";
import { ComponentBase } from "./base.component";

@Component({
	selector: "ids-datepicker",
	template: ` <div class="field">
		<label soho-label [attr.data-lmw-id]="autoId + '-label'">
			{{ "Datepicker" + (withTime ? " (with time)" : "") }}
			<br />
			ngModel: {{ model }}
		</label>
		<input
			soho-datepicker
			[options]="options"
			[(ngModel)]="model"
			[class.input-mm]="withTime"
			[disabled]="disabled" />
	</div>`,
})
export class DatepickerComponent extends ComponentBase implements OnInit {
	@Input() withTime = false;

	options: SohoDatePickerOptions;

	ngOnInit() {
		this.model = this.setDefaultValue
			? this.withTime
				? "01/01/2019 15:30:00"
				: "01/01/2019"
			: undefined;

		this.options = {
			dateFormat: "MM/dd/yyyy",
			placeholder: "MM/dd/yyyy",
			attributes: [{ name: "data-lmw-id", value: this.autoId }],
		};

		if (this.withTime) {
			this.options = {
				...this.options,
				showTime: true,
				timeFormat: "HH:mm:ss",
				useCurrentTime: true,
			};
		}
	}
}

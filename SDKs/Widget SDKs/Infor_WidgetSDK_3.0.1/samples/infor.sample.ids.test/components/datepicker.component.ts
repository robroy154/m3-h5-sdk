import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	ViewChild,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
	SohoDatePickerComponent,
	SohoDatePickerModule,
	SohoLabelModule,
} from "ids-enterprise-ng";
import { ComponentBase } from "./base.component";

@Component({
	selector: "test-ids-datepicker",
	template: `
		<div class="field">
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
		</div>
	`,
	imports: [
		SohoLabelModule,
		SohoDatePickerModule,
		ReactiveFormsModule,
		FormsModule,
	],
})
export class DatepickerComponent
	extends ComponentBase
	implements OnInit, OnChanges
{
	@ViewChild(SohoDatePickerComponent) datePicker?: SohoDatePickerComponent;
	@Input() withTime = false;

	options: SohoDatePickerOptions;

	ngOnChanges(changes: SimpleChanges): void {
		const disabledChange = changes["disabled"];
		if (disabledChange && !disabledChange.currentValue && this.datePicker) {
			// readOnly is being set to true when the datepicker is enabled, and setting it in the template doesn't work.
			this.datePicker.readonly = false;
		}
	}

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

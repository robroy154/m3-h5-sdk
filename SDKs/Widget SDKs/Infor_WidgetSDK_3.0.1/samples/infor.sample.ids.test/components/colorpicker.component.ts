import { Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
	SohoColorPickerModule,
	SohoInputValidateModule,
	SohoLabelModule,
} from "ids-enterprise-ng";
import { ComponentBase } from "./base.component";

@Component({
	selector: "test-ids-colorpicker",
	template: `
		<div class="field">
			<label soho-label [required]="true" [attr.data-lmw-id]="autoId + '-label'"
				>Colorpicker <br />
				ngModel: {{ model }}</label
			>
			<input
				soho-colorpicker
				[(ngModel)]="model"
				[clearable]="false"
				data-validate="required"
				[disabled]="disabled"
				[attr.data-lmw-id]="autoId"
				[attributes]="{ name: 'data-lmw-id', value: autoId }" />
		</div>
	`,
	imports: [
		SohoLabelModule,
		SohoColorPickerModule,
		SohoInputValidateModule,
		ReactiveFormsModule,
		FormsModule,
	],
})
export class ColorpickerComponent extends ComponentBase implements OnInit {
	ngOnInit() {
		this.model = this.setDefaultValue ? "#1a1a1a" : undefined;
	}
}

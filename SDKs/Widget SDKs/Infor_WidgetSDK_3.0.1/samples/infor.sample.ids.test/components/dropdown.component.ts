import { Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
	SohoDropDownModule,
	SohoInputValidateModule,
	SohoLabelModule,
} from "ids-enterprise-ng";
import { states } from "../data";
import { ComponentBase } from "./base.component";

@Component({
	selector: "test-ids-dropdown",
	template: `
		<div class="field">
			<label soho-label [required]="true" [attr.data-lmw-id]="autoId + '-label'"
				>Dropdown <br />
				ngModel: {{ model }}</label
			>
			<select
				soho-dropdown
				[(ngModel)]="model"
				data-validate="required"
				[disabled]="disabled"
				[attributes]="{ name: 'data-lmw-id', value: autoId }">
				@for (state of states; track state) {
					<option [value]="state.value">
						{{ state.label }}
					</option>
				}
			</select>
		</div>
	`,
	imports: [
		SohoLabelModule,
		SohoDropDownModule,
		SohoInputValidateModule,
		ReactiveFormsModule,
		FormsModule,
	],
})
export class DropdownComponent extends ComponentBase implements OnInit {
	states = states;

	ngOnInit() {
		this.model = this.setDefaultValue ? states[2].value : undefined;
	}
}

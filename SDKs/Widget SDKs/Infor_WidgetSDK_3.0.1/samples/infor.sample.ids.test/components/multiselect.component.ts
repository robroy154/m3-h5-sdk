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
	selector: "test-ids-multiselect",
	template: `
		<div class="field">
			<label
				soho-label
				[required]="true"
				[attr.data-lmw-id]="autoId + '-label'">
				Multiselect
				<br />
				ngModel: {{ model }}
			</label>
			<select
				soho-dropdown
				[multiple]="true"
				[closeOnSelect]="false"
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
		ReactiveFormsModule,
		SohoInputValidateModule,
		FormsModule,
	],
})
export class MultiselectComponent extends ComponentBase implements OnInit {
	states = states;

	ngOnInit() {
		this.model = this.setDefaultValue ? ["CA", "ND"] : undefined;
	}
}

import { Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonUtil } from "@infor-lime/core";
import { SohoCheckBoxModule, SohoLabelModule } from "ids-enterprise-ng";
import { ComponentBase } from "./base.component";

@Component({
	selector: "test-ids-checkbox",
	template: `
		<div class="field">
			<label soho-label [attr.data-lmw-id]="autoId + '-value'"
				>Checkbox & Switch <br />
				ngModel: {{ model }}</label
			>
			<input
				soho-checkbox
				type="checkbox"
				[(ngModel)]="model"
				[id]="random + 'checkbox'"
				[disabled]="disabled"
				[attr.data-lmw-id]="autoId + '-checkbox'" />
			<label
				soho-label
				[for]="random + 'checkbox'"
				[forCheckBox]="true"
				[attr.data-lmw-id]="autoId + '-checkbox-label'"
				>Tick</label
			>
		</div>
		<div class="field switch">
			<input
				type="checkbox"
				[(ngModel)]="model"
				[id]="random + 'switch'"
				class="switch"
				[disabled]="disabled"
				[attr.data-lmw-id]="autoId + '-switch'" />
			<label
				soho-label
				[for]="random + 'switch'"
				[forCheckBox]="true"
				[attr.data-lmw-id]="autoId + '-switch-label'"
				>Tick</label
			>
		</div>
	`,
	imports: [
		SohoLabelModule,
		ReactiveFormsModule,
		SohoCheckBoxModule,
		FormsModule,
	],
})
export class CheckboxComponent extends ComponentBase implements OnInit {
	random = CommonUtil.random(3);

	ngOnInit() {
		this.model = this.setDefaultValue ? true : undefined;
	}
}

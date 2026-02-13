import { Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
	SohoInputModule,
	SohoInputValidateModule,
	SohoLabelModule,
} from "ids-enterprise-ng";
import { ComponentBase } from "./base.component";

@Component({
	selector: "test-ids-input",
	template: `
		<div class="field">
			<label soho-label [required]="true" [attr.data-lmw-id]="autoId + '-label'"
				>Input <br />
				ngModel: {{ model }}</label
			>
			<input
				soho-input
				[(ngModel)]="model"
				data-validate="required"
				[disabled]="disabled"
				[attr.data-lmw-id]="autoId" />
		</div>
	`,
	imports: [
		SohoLabelModule,
		SohoInputModule,
		SohoInputValidateModule,
		ReactiveFormsModule,
		FormsModule,
	],
})
export class InputComponent extends ComponentBase implements OnInit {
	ngOnInit() {
		this.model = this.setDefaultValue ? "a text" : undefined;
	}
}

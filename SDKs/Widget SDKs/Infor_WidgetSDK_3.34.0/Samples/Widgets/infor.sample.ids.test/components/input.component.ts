import { Component, OnInit } from "@angular/core";
import { ComponentBase } from "./base.component";

@Component({
	selector: "ids-input",
	template: ` <div class="field">
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
	</div>`,
})
export class InputComponent extends ComponentBase implements OnInit {
	ngOnInit() {
		this.model = this.setDefaultValue ? "a text" : undefined;
	}
}

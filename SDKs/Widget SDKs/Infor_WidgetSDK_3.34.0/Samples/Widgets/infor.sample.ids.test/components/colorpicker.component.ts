import { Component, OnInit } from "@angular/core";
import { ComponentBase } from "./base.component";

@Component({
	selector: "ids-colorpicker",
	template: ` <div class="field">
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
	</div>`,
})
export class ColorpickerComponent extends ComponentBase implements OnInit {
	ngOnInit() {
		this.model = this.setDefaultValue ? "#1a1a1a" : undefined;
	}
}

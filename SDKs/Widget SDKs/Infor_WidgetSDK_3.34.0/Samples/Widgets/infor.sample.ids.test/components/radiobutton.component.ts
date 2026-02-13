import { Component, OnInit } from "@angular/core";
import { CommonUtil } from "lime";
import { ComponentBase } from "./base.component";

@Component({
	selector: "ids-radiobutton",
	template: ` <div class="field">
		<label soho-label [attr.data-lmw-id]="autoId + '-label'">
			Radiobutton
			<br />
			ngModel: {{ model }}
		</label>
		<input
			soho-radiobutton
			type="radio"
			[(ngModel)]="model"
			[value]="1"
			[id]="id + '1'"
			[attr.disabled]="disabledAttr"
			[attr.data-lmw-id]="autoId + '-1'" />
		<label
			soho-label
			[for]="id + '1'"
			[forRadioButton]="true"
			[attr.data-lmw-id]="autoId + '-1-label'"
			>One</label
		>
		<input
			soho-radiobutton
			type="radio"
			[(ngModel)]="model"
			[value]="2"
			[id]="id + '2'"
			[attr.disabled]="disabledAttr"
			[attr.data-lmw-id]="autoId + '-2'" />
		<label
			soho-label
			[for]="id + '2'"
			[forRadioButton]="true"
			[attr.data-lmw-id]="autoId + '-2-label'"
			>Two</label
		>
		<input
			soho-radiobutton
			type="radio"
			[(ngModel)]="model"
			[value]="3"
			[id]="id + '3'"
			[attr.disabled]="disabledAttr"
			[attr.data-lmw-id]="autoId + '-3'" />
		<label
			soho-label
			[for]="id + '3'"
			[forRadioButton]="true"
			[attr.data-lmw-id]="autoId + '-3-label'"
			>Three</label
		>
		<br />
	</div>`,
})
export class RadiobuttonComponent extends ComponentBase implements OnInit {
	id = CommonUtil.random(3);

	ngOnInit() {
		this.model = this.setDefaultValue ? 3 : 1;
	}
}

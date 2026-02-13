import { Component, OnInit } from "@angular/core";
import { states } from "../data";
import { ComponentBase } from "./base.component";

@Component({
	selector: "ids-dropdown",
	template: ` <div class="field">
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
			<option *ngFor="let state of states" [value]="state.value">
				{{ state.label }}
			</option>
		</select>
	</div>`,
})
export class DropdownComponent extends ComponentBase implements OnInit {
	states = states;

	ngOnInit() {
		this.model = this.setDefaultValue ? states[2].value : undefined;
	}
}

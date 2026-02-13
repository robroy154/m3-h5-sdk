import { Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
	SohoAutoCompleteModule,
	SohoInputValidateModule,
	SohoLabelModule,
} from "ids-enterprise-ng";
import { IState, states } from "../data";
import { ComponentBase } from "./base.component";
@Component({
	selector: "test-ids-autocomplete",
	template: `
		<div class="field">
			<label soho-label [required]="true" [attr.data-lmw-id]="autoId + '-label'"
				>Autocomplete <br />
				ngModel: {{ model.value }}</label
			>
			<input
				soho-autocomplete
				[disabled]="disabled"
				[source]="source"
				filterMode="contains"
				[(ngModel)]="model.label"
				(selected)="onSelected($event)"
				data-validate="required"
				placeholder="Type to search..."
				[attr.data-lmw-id]="autoId"
				[attributes]="[{ name: 'data-lmw-id', value: autoId }]" />
		</div>
	`,
	imports: [
		SohoLabelModule,
		SohoAutoCompleteModule,
		SohoInputValidateModule,
		ReactiveFormsModule,
		FormsModule,
	],
})
export class AutocompleteComponent
	extends ComponentBase<IState>
	implements OnInit
{
	states = states;

	ngOnInit() {
		const stateShallowCopy = { ...this.states[2] };
		this.model = this.setDefaultValue ? stateShallowCopy : {};
	}

	onSelected(event: unknown[]) {
		this.model = event[2];
	}

	source = (
		term: string,
		response: (term: string, array: IState[]) => void,
	) => {
		response(term, this.states);
	};
}

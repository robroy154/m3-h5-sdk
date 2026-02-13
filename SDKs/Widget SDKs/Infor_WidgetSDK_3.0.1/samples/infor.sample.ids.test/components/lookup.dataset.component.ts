import { Component, Input, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
	SohoBusyIndicatorModule,
	SohoInputValidateModule,
	SohoLabelModule,
	SohoLookupModule,
} from "ids-enterprise-ng";
import { checkboxColumn, lookupColumns, lookupDataset } from "../data";
import { ComponentBase } from "./base.component";

@Component({
	selector: "test-ids-dataset-lookup",
	template: `
		<div class="field">
			<label
				soho-label
				[required]="true"
				[attr.data-lmw-id]="autoId + '-label'">
				Lookup ({{ labelInfo }})
				<br />
				ngModel: {{ model }}
			</label>
			<input
				soho-lookup
				[attributes]="[{ name: 'data-lmw-id', value: autoId }]"
				[(ngModel)]="model"
				[columns]="columns"
				[dataset]="dataset"
				[beforeShow]="isAsync ? beforeShow : undefined"
				data-validate="required"
				[multiselect]="isMulti"
				field="productId"
				[attr.disabled]="disabled ? '' : null"
				soho-busyindicator
				[activated]="isBusy"
				[displayDelay]="0" />
		</div>
	`,
	imports: [
		SohoLabelModule,
		SohoLookupModule,
		SohoInputValidateModule,
		ReactiveFormsModule,
		SohoBusyIndicatorModule,
		FormsModule,
	],
})
export class LookupDatasetComponent extends ComponentBase implements OnInit {
	@Input() isMulti: boolean;
	@Input() isAsync: boolean;

	columns: SohoDataGridColumn[] = [...lookupColumns];
	dataset: typeof lookupDataset;
	labelInfo: string;
	isBusy: boolean;

	beforeShow = (
		lookup: SohoLookupStatic,
		response: SohoLookupBeforeShowResponse,
	) => {
		this.isBusy = true;
		setTimeout(() => {
			this.dataset = [...lookupDataset];
			response();
			this.isBusy = false;
		}, 1000);
	};

	ngOnInit() {
		this.model = this.setDefaultValue
			? this.isMulti
				? ["first", "second"]
				: "first"
			: undefined;
		if (!this.isAsync) {
			this.dataset = [...lookupDataset];
		}

		if (this.isMulti) {
			this.columns.unshift(checkboxColumn);
		}

		this.labelInfo =
			(this.isAsync ? "async " : "") +
			"dataset " +
			(this.isMulti ? "multi" : "single") +
			" select";
	}
}

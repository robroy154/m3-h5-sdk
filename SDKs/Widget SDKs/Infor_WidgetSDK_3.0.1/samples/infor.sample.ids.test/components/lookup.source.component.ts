import { Component, Input, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
	SohoInputValidateModule,
	SohoLabelModule,
	SohoLookupModule,
} from "ids-enterprise-ng";
import { checkboxColumn, lookupColumns, lookupDataset } from "../data";
import { ComponentBase } from "./base.component";

@Component({
	selector: "test-ids-source-lookup",
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
				[options]="gridOptions"
				[source]="lookupSource"
				data-validate="required"
				[multiselect]="isMulti"
				field="productId"
				[attr.disabled]="disabled ? '' : null" />
		</div>
	`,
	imports: [
		SohoLabelModule,
		SohoLookupModule,
		SohoInputValidateModule,
		ReactiveFormsModule,
		FormsModule,
	],
})
export class LookupSourceComponent extends ComponentBase implements OnInit {
	@Input() isMulti: boolean;
	@Input() isAsync: boolean;

	columns: SohoDataGridColumn[] = [...lookupColumns];
	dataset = [...lookupDataset];
	labelInfo: string;
	gridOptions: SohoDataGridOptions = {
		paging: true,
		pagesize: 5,
		pagesizes: [3, 5, 10, 15],
		allowSelectAcrossPages: true,
	};

	ngOnInit() {
		this.model = this.setDefaultValue
			? this.isMulti
				? ["first", "second"]
				: "first"
			: undefined;
		this.labelInfo =
			(this.isAsync ? "async " : "") +
			"source " +
			(this.isMulti ? "multi" : "single") +
			" select";

		if (this.isMulti) {
			this.columns.unshift(checkboxColumn);
		}
	}

	lookupSource = (
		req: SohoDataGridSourceRequest,
		response: SohoDataGridResponseFunction,
	) => {
		const filter =
			req.filterExpr && req.filterExpr[0] && req.filterExpr[0].value;
		const result = this.getData(filter, req.activePage, req.pagesize);
		req.total = result.total;

		setTimeout(
			() => {
				response(result.data, req);
			},
			this.isAsync ? 1000 : 0,
		);
	};

	private getData(
		filter: string,
		page: number,
		pageSize: number,
	): { total: number; data: typeof lookupDataset } {
		let dataResult = this.dataset;

		if (filter) {
			dataResult = this.dataset.filter(
				(data) =>
					data.productId.includes(filter) ||
					data.productName.toLowerCase().includes(filter),
			);
		}

		const startIndex = (page - 1) * pageSize;
		const endIndex = page * pageSize;
		dataResult = dataResult.slice(startIndex, endIndex);

		return {
			total: this.dataset.length,
			data: dataResult,
		};
	}
}

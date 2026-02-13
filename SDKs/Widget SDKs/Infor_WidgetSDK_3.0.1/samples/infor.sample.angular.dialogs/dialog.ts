import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import { SohoModalDialogRef } from "ids-enterprise-ng";

@Component({
	template: `
		<ids-input
			label="Dialog parameter"
			[value]="dialogParameter"
			readonly
			maxlength="64" />
		<ids-input
			label="Dialog result"
			[value]="dialogResult"
			(change)="dialogResult = $event.detail.value"
			maxlength="64" />

		<!-- TODO: Remove and use <ids-modal> -->
		<div class="modal-buttonset">
			<button class="btn-modal" (click)="dialog?.close()">Cancel</button>
			<button class="btn-modal-primary" (click)="onOk()">OK</button>
		</div>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomDialogComponent {
	dialog: SohoModalDialogRef<CustomDialogComponent>; // TODO: Remove and use <ids-modal>
	dialogParameter: string;
	dialogResult = "Sample dialog result";

	onOk(): void {
		this.dialog.close({ value: this.dialogResult });
	}
}

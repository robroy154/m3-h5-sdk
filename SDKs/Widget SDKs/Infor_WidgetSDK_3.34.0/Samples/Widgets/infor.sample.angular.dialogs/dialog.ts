import { Component } from "@angular/core";
import { SohoModalDialogRef } from "@infor/sohoxi-angular";

@Component({
	template: ` <div>
		<form role="form">
			<div class="row">
				<div class="one-half column">
					<div class="field">
						<label [for]="'input-parameter' + instanceId"
							>Dialog parameter</label
						>
						<input
							[id]="'input-parameter' + instanceId"
							[(ngModel)]="dialogParameter"
							maxlength="64"
							name="dialogparam" />
					</div>
				</div>
			</div>
			<div class="row">
				<div class="one-half column">
					<div class="field">
						<label [for]="'input-result' + instanceId">Dialog result</label>
						<input
							[id]="'input-result' + instanceId"
							[(ngModel)]="dialogResult"
							maxlength="64"
							name="dialogresult" />
					</div>
				</div>
			</div>
			<div class="modal-buttonset">
				<button class="btn-modal" (click)="dialog?.close()">Cancel</button>
				<button class="btn-modal-primary" (click)="onOk()">OK</button>
			</div>
		</form>
	</div>`,
})
export class CustomDialogComponent {
	dialog: SohoModalDialogRef<CustomDialogComponent>;
	dialogParameter: string;
	dialogResult = "Sample dialog result";
	instanceId: string;

	onOk(): void {
		this.dialog.close({ value: this.dialogResult });
	}
}

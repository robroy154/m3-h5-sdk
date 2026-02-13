import { Component } from "@angular/core";
import { SohoModalDialogRef } from "@infor/sohoxi-angular";
import { IWidgetContext, IWidgetInstance } from "lime";

/* ID:s do not need to be _completely_ unique in modals, since there should only ever be one instance */
/* eslint-disable lime/no-id */

@Component({
	template: `
		<div id="lm-tst-mod">
			<ids-components
				[widgetContext]="widgetContext"
				[widgetInstance]="widgetInstance"
				[openedAsModal]="true"
				[setDefaultValues]="setDefaultValues">
			</ids-components>
			<div class="modal-buttonset">
				<button
					class="btn-modal"
					id="{{ autoId }}-cancel"
					(click)="modalRef.close()">
					Cancel
				</button>
				<button
					class="btn-modal-primary"
					id="{{ autoId }}-ok"
					(click)="modalRef.close()">
					OK
				</button>
			</div>
		</div>
	`,
})
export class IDSModalComponent {
	widgetContext: IWidgetContext;
	widgetInstance: IWidgetInstance;
	modalRef: SohoModalDialogRef<IDSModalComponent>;
	setDefaultValues = false;
	autoId: string;
}

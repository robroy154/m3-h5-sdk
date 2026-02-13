import { NgClass } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core";
import { SohoModalDialogRef } from "ids-enterprise-ng";

export interface IMyDialogParameters {
	topIcon: string;
	middleIcon: string;
	bottomIcon: string;
}

@Component({
	template: `
		<div>
			<div class="lm-text-align-c">
				<ids-button [icon]="buttonIcon" (click)="toggleClass()"></ids-button>
				{{ buttonMessage }}
			</div>
			<div class="infor-sample-minify-widget-dialog-max-width">
				<img class="merge" src="{{ topIcon }}" [ngClass]="{ show: show }" />
				<img class="merge" src="{{ middleIcon }}" [ngClass]="{ show: show }" />
				<img class="merge" src="{{ bottomIcon }}" [ngClass]="{ show: show }" />
			</div>
			<div class="modal-buttonset">
				<button class="btn-modal" (click)="onClose()">Close</button>
			</div>
		</div>
	`,
	styles: [
		`
			.infor-sample-minify-widget-dialog-max-width {
				max-width: 400px;
				min-height: 240px;
			}
		`,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [NgClass],
})
export class MyDialogComponent implements OnInit {
	dialog: SohoModalDialogRef<MyDialogComponent>;
	parameters: IMyDialogParameters;

	topIcon: string;
	middleIcon: string;
	bottomIcon: string;
	buttonMessage: string;
	show: boolean;
	buttonIcon = "maximize";
	constructor() {
		this.buttonMessage = "Divide images";
		this.show = true;
	}

	ngOnInit(): void {
		this.topIcon = this.parameters.topIcon;
		this.middleIcon = this.parameters.middleIcon;
		this.bottomIcon = this.parameters.bottomIcon;
	}

	toggleClass(): void {
		if (this.show) {
			this.show = false;
			this.buttonMessage = "Combine images";
			this.buttonIcon = "minimize";
		} else {
			this.show = true;
			this.buttonMessage = "Divide images";
			this.buttonIcon = "maximize";
		}
	}

	onClose(): void {
		this.dialog.close({
			value: "someResult",
		});
	}
}

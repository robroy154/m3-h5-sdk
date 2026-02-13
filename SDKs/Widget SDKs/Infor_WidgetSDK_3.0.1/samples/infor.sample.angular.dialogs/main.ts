import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from "@angular/core";
import {
	DialogButtonType,
	DialogService,
	IDialogResult,
	StandardDialogButtons,
} from "@infor-lime/core";
import { SohoModalDialogService } from "ids-enterprise-ng";
import { CustomDialogComponent } from "./dialog";

@Component({
	template: `
		<ids-layout-grid auto-fit min-col-width="200px">
			<ids-layout-grid-cell justify-content="center">
				<ids-button appearance="secondary" (click)="showMessage()">
					Open message dialog
				</ids-button>
			</ids-layout-grid-cell>
			<ids-layout-grid-cell justify-content="center">
				<ids-button appearance="secondary" (click)="showConfirm()">
					Open confirm dialog
				</ids-button>
			</ids-layout-grid-cell>
			<ids-layout-grid-cell justify-content="center">
				<ids-button appearance="secondary" (click)="showCustom()">
					Open custom dialog
				</ids-button>
			</ids-layout-grid-cell>
			<ids-layout-grid-cell justify-content="center">
				<ids-button appearance="secondary" (click)="toast.show()">
					Show toast message
				</ids-button>
				<ids-toast #toast destroy-on-complete="false">
					<ids-text slot="title">A sample toast title</ids-text>
					<ids-text slot="message">A sample toast message</ids-text>
				</ids-toast>
			</ids-layout-grid-cell>
		</ids-layout-grid>
	`,
	imports: [CustomDialogComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DialogsComponent {
	private dialogService = inject(DialogService);
	private sohoModalDialogService = inject(SohoModalDialogService);

	showMessage(): void {
		// TODO: Use <ids-message> instead
		this.dialogService.showMessage({
			title: "A sample title",
			message: "A sample message",
		});
	}

	showConfirm(): void {
		// TODO: Use <ids-message> instead
		this.dialogService
			.showMessage({
				title: "Confirm",
				message: "Are you sure?",
				standardButtons: StandardDialogButtons.YesNo,
			})
			.subscribe((result: IDialogResult) => {
				let message: string;
				let title: string;

				if (result.button === DialogButtonType.Yes) {
					title = "Confirmed";
					message = "You are sure.";
				} else {
					title = "Not confirmed";
					message = "You are not sure.";
				}
				this.dialogService.showMessage({
					title: title,
					message: message,
				});
			});
	}

	showCustom() {
		// TODO: Use <ids-modal> instead
		const dialog = this.sohoModalDialogService
			.modal(CustomDialogComponent)
			.title("A custom dialog title")
			.afterClose((result: IDialogResult) => {
				const message: string = result
					? (result.value as string)
					: "Dialog cancelled";
				this.dialogService.showMessage({
					title: "Result",
					message: message,
				});
			});

		dialog
			.apply((component: CustomDialogComponent) => {
				component.dialog = dialog;
				component.dialogParameter = "A sample custom dialog parameter";
			})
			.open();
	}
}

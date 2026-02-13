import { AsyncPipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from "@angular/core";
import {
	IWidgetContext,
	Log,
	WidgetMessageType,
	WidgetState,
} from "@infor-lime/core";
import { firstValueFrom } from "rxjs";
import { DataService } from "./service";

@Component({
	template: `
		@if (user | async; as user) {
			<ids-layout-flex gap="12" direction="column">
				<ids-layout-flex-item>
					<ids-text label="true">Name</ids-text>
					<ids-text font-weight="semi-bold">
						{{ user.name.givenName + " " + user.name.familyName }}
					</ids-text>
				</ids-layout-flex-item>

				<ids-layout-flex-item>
					<ids-text label="true">Email</ids-text>
					<ids-text font-weight="semi-bold">
						{{ user.emails?.[0]?.value }}
					</ids-text>
				</ids-layout-flex-item>

				<ids-layout-flex-item>
					<ids-image [attr.src]="user.profilePicture?.cdnPathLargeImage" />
				</ids-layout-flex-item>
			</ids-layout-flex>
		}
	`,
	imports: [AsyncPipe],
	styles: `
		:host {
			display: block;
			padding-inline: var(--ids-space-sm);
		}
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IonApiComponent {
	private dataService = inject(DataService);
	private widgetContext = inject(IWidgetContext);

	user = this.loadUser();
	private logPrefix = "[IonApiSample] ";
	private language = this.widgetContext.getLanguage();

	private async loadUser() {
		try {
			this.setBusy(true);
			const user = await firstValueFrom(
				this.dataService.loadUser(this.widgetContext),
			);
			return user;
		} catch (error) {
			this.onRequestError(
				error as HttpErrorResponse,
				this.language.get("loadError"),
			);
			return null;
		} finally {
			this.setBusy(false);
		}
	}

	private setBusy(isBusy: boolean): void {
		this.widgetContext.setState(
			isBusy ? WidgetState.busy : WidgetState.running,
		);
	}

	private onRequestError(error: HttpErrorResponse, message: string): void {
		Log.error(this.logPrefix + "ION API Error: " + JSON.stringify(error));
		this.widgetContext.showWidgetMessage({
			message: message,
			type: WidgetMessageType.Error,
		});
		this.setBusy(false);
	}
}

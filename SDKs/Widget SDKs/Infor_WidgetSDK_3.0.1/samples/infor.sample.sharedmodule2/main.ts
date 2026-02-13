import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from "@angular/core";
import { IWidgetContext, Log, WidgetState } from "@infor-lime/core";
import {
	IUserContext,
	UserContextService,
} from "@shared/sample-shared-usercontext";

@Component({
	template: `
		<ids-layout-flex direction="column" gap="12">
			<ids-layout-flex-item>
				<ids-text font-size="12" text-align="center">
					User context will be loaded only once and shared among all widgets
					using the specified shared module
				</ids-text>
			</ids-layout-flex-item>

			<ids-layout-flex-item align-self="center">
				<ids-button appearance="primary" (click)="getAndSetUserContext()">
					Get user info
				</ids-button>
			</ids-layout-flex-item>

			<ids-layout-flex-item>
				<ids-input
					label="Name"
					[value]="userContext?.name"
					readonly></ids-input>
				<ids-input
					label="User ID"
					[value]="userContext?.userId"
					readonly></ids-input>

				<ids-layout-flex gap="12">
					<ids-input
						label="Department"
						[value]="userContext?.department"
						readonly
						size="sm"></ids-input>
					<ids-input
						label="Area"
						[value]="userContext?.area"
						readonly
						size="xs"></ids-input>
				</ids-layout-flex>
			</ids-layout-flex-item>
		</ids-layout-flex>
	`,
	styles: `
		:host {
			display: block;
			padding-inline: var(--ids-space-sm);
		}
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModuleSampleTwoComponent {
	private widgetContext = inject(IWidgetContext);
	private userContextService = inject(UserContextService);

	userContext?: IUserContext;

	getAndSetUserContext(): void {
		this.setBusy(true);
		this.userContextService.getUserContext(this.widgetContext).subscribe(
			(result: IUserContext) => {
				this.userContext = result;
			},
			(onError) => {
				Log.error(`Failed to get User Context ${onError}`);
			},
			() => {
				this.setBusy(false);
			},
		);
	}

	private setBusy(isBusy: boolean): void {
		this.widgetContext.setState(
			isBusy ? WidgetState.busy : WidgetState.running,
		);
	}
}

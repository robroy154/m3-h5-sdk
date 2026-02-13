import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	OnInit,
	inject,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IWidgetContext } from "@infor-lime/core";
import { SohoToastService } from "ids-enterprise-ng";
import { tap } from "rxjs/operators";
import { IdsInputValueAccessorDirective } from "../../infor.sample.angular.contenttranslation/ids-value-accessor.directive";
import { IManifestLanguage } from "../manifest-types";
import { IUser, UserService } from "../services/user.service";
import { IWorkspaceComponent } from "../services/workspace.service";

@Component({
	template: `
		<ids-layout-grid padding="sm" auto-fit min-col-width="100%">
			<ids-layout-grid-cell>
				<ids-text font-size="20" label="true"
					>{{ user.firstName }} {{ user.lastName }}</ids-text
				>
			</ids-layout-grid-cell>
			<ids-layout-grid-cell>
				<ids-layout-flex>
					<ids-layout-flex-item class="osp-margin-lg-r">
						<img
							style="border-radius:50%; width: 80px;"
							[src]="user.photoUrl" />
					</ids-layout-flex-item>
					<ids-layout-flex-item>
						<ids-text font-size="16" label="true"> {{ lang.title }}</ids-text>
						<ids-text font-size="16" data="true">{{ user.title }}</ids-text>
						<ids-text font-size="16" label="true">{{ lang.email }}</ids-text>
						<ids-text font-size="16" data="true">{{ user.email }}</ids-text>
					</ids-layout-flex-item>
				</ids-layout-flex>
			</ids-layout-grid-cell>
			<ids-separator></ids-separator>
			<ids-layout-grid-cell>
				<ids-layout-flex>
					<ids-layout-flex-item class="osp-margin-lg-r">
						<ids-input
							[label]="lang.firstName"
							validate="required"
							[(ngModel)]="editableUser.firstName"
							[disabled]="readOnly"></ids-input>
					</ids-layout-flex-item>
					<ids-layout-flex-item>
						<ids-input
							[label]="lang.lastName"
							validate="required"
							[(ngModel)]="editableUser.lastName"
							[disabled]="readOnly"></ids-input>
					</ids-layout-flex-item>
				</ids-layout-flex>
			</ids-layout-grid-cell>
			<ids-layout-grid-cell>
				<ids-layout-flex>
					<ids-layout-flex-item class="osp-margin-lg-r">
						<ids-input
							[label]="lang.title"
							[(ngModel)]="editableUser.title"
							[disabled]="readOnly" />
					</ids-layout-flex-item>
					<ids-layout-flex-item>
						<ids-input
							[label]="lang.email"
							[(ngModel)]="editableUser.email"
							[disabled]="readOnly" />
					</ids-layout-flex-item>
				</ids-layout-flex>
			</ids-layout-grid-cell>
		</ids-layout-grid>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [IdsInputValueAccessorDirective, FormsModule],
})
export class UserWorkspaceComponent implements IWorkspaceComponent, OnInit {
	private userService = inject(UserService);
	private toastService = inject(SohoToastService);

	widgetContext: IWidgetContext;
	lang?: IManifestLanguage;
	user?: IUser;
	editableUser?: IUser;
	readOnly: boolean;

	ngOnInit() {
		this.editableUser = { ...this.user };
		this.lang = this.widgetContext.getLanguage<IManifestLanguage>();
	}

	submitClicked() {
		return this.userService.update(this.editableUser).pipe(
			tap(() => {
				this.toastService.show({
					title: this.lang.submitToastTitle,
					message: this.lang.submitToastMessage,
					timeout: 2000,
					position: SohoToastService.BOTTOM_RIGHT,
				});
			}),
		);
	}

	launchClicked() {
		// this.widgetContext.launch({ ... })
		this.toastService.show({
			title: this.lang.launchToastTitle,
			message: this.lang.launchToastMessage,
			timeout: 2000,
			position: SohoToastService.BOTTOM_RIGHT,
		});
	}
}

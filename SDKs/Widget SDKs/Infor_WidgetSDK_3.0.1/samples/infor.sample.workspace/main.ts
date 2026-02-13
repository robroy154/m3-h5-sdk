import { Component, ViewContainerRef, inject } from "@angular/core";
import { IWidgetContext, Mode } from "@infor-lime/core";
import { UserListComponent } from "./components/user-list.component";
import { UserWorkspaceComponent } from "./components/user-workspace.component";
import { IManifestLanguage } from "./manifest-types";
import { IUser } from "./services/user.service";
import { WorkspaceService } from "./services/workspace.service";

@Component({
	template: `
		<sample-user-list
			(userEditClick)="openWorkspace($event)"
			(userViewClick)="openWorkspace($event, true)">
		</sample-user-list>
	`,
	imports: [UserListComponent],
})
export class WorkspaceWidgetComponent {
	private widgetContext = inject(IWidgetContext);
	private workspaceService = inject(WorkspaceService);
	private viewRef = inject(ViewContainerRef);

	openWorkspace(user: IUser, readOnly?: boolean) {
		this.workspaceService.open({
			component: UserWorkspaceComponent,
			title: this.workspaceTitle(readOnly),
			viewRef: this.viewRef,
			props: {
				user: user,
				readOnly,
				widgetContext: this.widgetContext,
			},
		});
	}

	private workspaceTitle(readOnly: boolean) {
		if (this.widgetContext.getMode() !== Mode.Mobile) {
			const language = this.widgetContext.getLanguage<IManifestLanguage>();
			return readOnly ? language.userDetails : language.editUser;
		}
	}
}

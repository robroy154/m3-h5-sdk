import { AsyncPipe } from "@angular/common";
import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	EventEmitter,
	Output,
	inject,
} from "@angular/core";
import { Observable } from "rxjs";
import { IUser, UserService } from "../services/user.service";

@Component({
	selector: "sample-user-list",
	template: `
		<ids-list-view [selectable]="false">
			@for (user of users$ | async; track user) {
				<ids-list-view-item>
					<ids-layout-flex>
						<ids-layout-flex-item grow="1">
							<ids-text font-weight="bold" font-size="16" type="h2">
								{{ user.firstName }} {{ user.lastName }}
							</ids-text>
							<ids-text font-size="12">{{ user.email }}</ids-text>
						</ids-layout-flex-item>
						<ids-layout-flex-item>
							<ids-button
								icon="user"
								(click)="userViewClick.emit(user)"></ids-button>
							<ids-button
								icon="edit"
								(click)="userEditClick.emit(user)"></ids-button>
						</ids-layout-flex-item>
					</ids-layout-flex>
				</ids-list-view-item>
			}
		</ids-list-view>
	`,
	styles: [
		`
			button {
				float: right;
				bottom: 25px;
			}
		`,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [AsyncPipe],
})
export class UserListComponent {
	private userService = inject(UserService);

	@Output() userEditClick = new EventEmitter<IUser>();
	@Output() userViewClick = new EventEmitter<IUser>();

	users$: Observable<IUser[]> = this.userService.users$;
}

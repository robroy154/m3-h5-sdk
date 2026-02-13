import { Injectable, inject } from "@angular/core";
import { IWidgetContext } from "@infor-lime/core";
import { SharedToastService } from "@shared/sample-shared-toast-service";
import { Observable, map, shareReplay, timer } from "rxjs";

const USE_MOCK_DATA = true;

export interface IUserContext {
	name: string;
	userId: string;
	department?: string;
	area?: string;
}

@Injectable({
	providedIn: "root",
})
export class UserContextService {
	private toastService = inject(SharedToastService);

	private numRequests = 0;
	private userContext$?: Observable<IUserContext>;

	getUserContext(widgetContext: IWidgetContext): Observable<IUserContext> {
		this.numRequests++;

		if (this.userContext$) {
			// User context has already been loaded once, so re-use it
			this.showContextReusedMessage();
		} else {
			// First time user context is requested, so load it from the server
			this.showLoadContextMessage();
			this.userContext$ = this.loadUserContext(widgetContext).pipe(
				shareReplay(1), // Make sure late subscribers re-use the same value
			);
		}

		return this.userContext$;
	}

	private loadUserContext(
		widgetContext: IWidgetContext,
	): Observable<IUserContext> {
		// Using mock data for sample
		if (USE_MOCK_DATA) {
			return timer(3000).pipe(
				map(() => {
					const mockUserContext: IUserContext = {
						name: "Hulk Holding",
						userId: "hholding",
						department: "Dept. A",
						area: "10",
					};
					return mockUserContext;
				}),
			);
		}

		// Real scenario would be to load the context through some ION API ***
		return widgetContext
			.executeIonApiAsync<IUserContext>({
				url: "/M3/m3api-rest/execute/MNS150MI/GetUserData",
				method: "GET",
			})
			.pipe(map((response) => response.data));
	}

	private showContextReusedMessage(): void {
		this.toastService.showToast(
			"Using existing user context",
			`User Context has been requested ${this.numRequests} times, but only loaded from the server once`,
		);
	}

	private showLoadContextMessage(): void {
		this.toastService.showToast(
			"User Context loaded",
			"User Context has not previously been loaded, so it has to be fetched from the server",
		);
	}
}

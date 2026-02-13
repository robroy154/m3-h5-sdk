import { Injectable } from "@angular/core";
import { IIonApiRequestOptions, IWidgetContext } from "@infor-lime/core";
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { IUser, IUserDetailResponse } from "./interfaces";

@Injectable({
	providedIn: "root",
})
export class DataService {
	private serviceUrl = "ifsservice";
	private user: IUser;

	loadUser(widgetContext: IWidgetContext): Observable<IUser> {
		if (this.user) {
			return of(this.user);
		}

		const request = this.createRequest("usermgt/v2/users/me");
		return widgetContext.executeIonApiAsync<IUserDetailResponse>(request).pipe(
			map((response) => response.data.response.userlist[0]),
			tap((user) => (this.user = user)),
		);
	}

	private createRequest(
		relativeUrl: string,
		headers?: object,
	): IIonApiRequestOptions {
		if (!headers) {
			headers = { Accept: "application/json" };
		}

		// Create the relative URL to the ION API
		const url = this.serviceUrl + "/" + relativeUrl;

		// Create HTTP GET request object
		const request: IIonApiRequestOptions = {
			method: "GET",
			url: url,
			cache: false,
			headers: headers || null,
		};

		return request;
	}
}

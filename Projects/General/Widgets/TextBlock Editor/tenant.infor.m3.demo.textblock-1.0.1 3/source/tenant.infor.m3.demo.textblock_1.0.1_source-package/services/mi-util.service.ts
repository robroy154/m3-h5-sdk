/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from "@angular/core";

import {
	IIonApiRequestOptions,
	IIonApiResponse,
	IWidgetContext,
	widgetContextInjectionToken,
} from "@infor-lime/core";
import { Observable, of, switchMap, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export interface IMIResponse {
	Program: string;
	Transaction: string;
	results: IMIResult[];
	nrOfFailedTransactions?: number;
}

export interface IMIResult {
	records: IMIRecord[];
	errorMessage?: string;
	errorField?: string;
}

export interface IMIRecord {
	[key: string]: string;
}

export interface IMIError {
	headers: Headers;
	status: number;
	statusText: string;
	url: string;
	ok: boolean;
	name: string;
	message: string;
	error: Error;
}

@Injectable({
	providedIn: "root",
})
export class MiUtilService {
	constructor(
		@Inject(widgetContextInjectionToken)
		private readonly widgetContext: IWidgetContext,
	) {}

	private isDateInRange(fromDateStr: string, toDateStr: string): boolean {
		const fromDate = this.parseDate(fromDateStr);
		const toDate = this.parseDate(toDateStr);
		const todayStr = this.getTodayDateYYYYMMDD();
		const todayDate = this.parseDate(todayStr);

		return fromDate <= todayDate && todayDate <= toDate;
	}

	private parseDate(dateStr: string): Date {
		const year = parseInt(dateStr.substring(0, 4), 10);
		const month = parseInt(dateStr.substring(4, 6), 10) - 1; // Months are zero-based
		const day = parseInt(dateStr.substring(6, 8), 10);
		return new Date(year, month, day);
	}

	private getTodayDateYYYYMMDD(): string {
		const today = new Date();
		const year = today.getFullYear();
		const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
		const day = today.getDate().toString().padStart(2, "0");
		return `${year}${month}${day}`;
	}

	private formatDate(date: Date): string {
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		return `${year}${month}`;
	}

	getM3User(): Observable<any> {
		const request: IIonApiRequestOptions = this.createRequest(
			"MNS150MI",
			"GetUserData",
			{},
			1,
		);
		return this.widgetContext.executeIonApiAsync<IMIResponse>(request).pipe(
			switchMap((response) => {
				return this.handleResponse(response, 1);
			}),
			catchError((error: IMIError) => this.handleError(error)),
		);
	}

	private handleError(error: IMIError) {
		const errorMessage = error.message ?? "";
		return throwError(() => new Error(errorMessage));
	}

	private handleResponse(
		response: IIonApiResponse<IMIResponse>,
		responseLength?: number,
	): Observable<IMIRecord[] | IMIRecord> {
		const data = response.data?.results?.length
			? response.data.results[0]
			: null;

		if (data?.errorMessage) {
			const errorMessage = `${data["errorMessage"]} ${
				data["errorField"] ? "(" + data["errorField"] + ")" : ""
			}`;

			return throwError(() => new Error(errorMessage));
		}

		const records = data?.records?.length
			? this.removePrefix(data.records)
			: [];

		if (responseLength === 1) {
			return of(records[0] as IMIRecord);
		}
		return of(records as IMIRecord[]);
	}

	private removePrefix(items: any[]) {
		if (!items.length) {
			return items;
		}
		// Iterate through each object in the array
		items.forEach((obj) => {
			// Iterate through each key-value pair using Object.entries()
			Object.entries(obj).forEach(([key, value], i: number) => {
				// Check if the key is 6 characters long
				if (key.length === 6) {
					// Remove the first two characters from the key and update the object
					obj[key.slice(2)] = value;

					// Delete the old key
					delete obj[key];
					obj["id"] = i;
				}
			});
		});

		return items;
	}

	/* 	private handleResponse(
		response: IIonApiResponse<IMIResponse | any>,
	): Observable<IMIResult> {
		const data = response.data?.results?.length ? response.data.results[0] : [];
		return of(data);
	} */

	execute(
		program: string,
		transaction: string,
		parameters: IMIRecord = {},
		maxReturnRecords = 0,
		outputData?: string,
		ignoreError = false,
	): Observable<any> {
		const request: IIonApiRequestOptions = this.createRequest(
			program,
			transaction,
			parameters,
			maxReturnRecords,
			outputData,
		);

		return this.widgetContext.executeIonApiAsync<IMIResponse>(request).pipe(
			switchMap((response) => {
				return this.handleResponse(response, maxReturnRecords);
			}),
			catchError((error: IMIError) =>
				ignoreError ? of([]) : this.handleError(error),
			),
		);
	}

	private createRequest(
		program: string,
		transaction: string,
		parameters: IMIRecord = {},
		maxReturnRecords = 0,
		outputData?: string,
	): IIonApiRequestOptions {
		const max = maxReturnRecords
			? `maxrecs=${maxReturnRecords};`
			: `maxrecs=6000;`;
		const output = outputData ? `returncols=${outputData};` : "";
		return {
			method: "GET",
			url: `/M3/m3api-rest/v2/execute/${program}/${transaction};${max}${output}`,
			params: parameters,
			cache: false,
			headers: {
				Accept: "application/json",
			},
		};
	}
}

import { Injectable, inject } from "@angular/core";
import { map } from "rxjs";
import { MiUtilService } from "./mi-util.service";

@Injectable({
	providedIn: "root",
})
export class TextBlockParameterService {
	#miUtil = inject(MiUtilService);

	getParByPgm(program: string) {
		const parameters = {
			PGNM: program,
		};
		return this.#miUtil
			.execute("BOOKMKMI", "GetParByPgm", parameters, 1, "", true)
			.pipe(map((resp) => this.massageSearchData(resp)));
	}

	private massageSearchData(responseData: any): any {
		if (!responseData) return null;
		const result: any = {};
		let firstNonExcludedKvKey: string | null = null;

		// Handle KF01-KF16 properties
		for (let i = 1; i <= 16; i++) {
			const kfKey = `KF${i.toString().padStart(2, "0")}`;
			const kvKey = `KV${i.toString().padStart(2, "0")}`;

			if (responseData[kfKey] !== "") {
				let value = responseData[kfKey];
				// If value is 6 characters, remove first 2 characters
				if (typeof value === "string" && value.length === 6) {
					value = value.slice(2);
				}
				if (value) {
					// Check if this is the first non-excluded value
					if (
						!firstNonExcludedKvKey &&
						!["CONO", "DIVI", "FACI", "WHLO"].includes(value)
					) {
						firstNonExcludedKvKey = kvKey;
					} else if (["CONO", "DIVI", "FACI", "WHLO"].includes(value)) {
						value = "USER-" + value;
					}
					result[kvKey] = [value];
				}
			}
		}

		// Set KFLD to the first kvKey with non-excluded value
		if (firstNonExcludedKvKey) {
			result.KFLD = firstNonExcludedKvKey;
		}

		result["FILE"] = responseData.FILE;

		return result;
	}
}

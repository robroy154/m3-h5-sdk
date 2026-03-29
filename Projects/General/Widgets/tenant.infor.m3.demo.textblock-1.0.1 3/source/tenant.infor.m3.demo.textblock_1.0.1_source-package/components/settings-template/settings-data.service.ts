import { inject, Injectable } from "@angular/core";
import { IdsDropdownOptions } from "ids-enterprise-wc/components/ids-dropdown/ids-dropdown-common";
import { forkJoin, map } from "rxjs";
import { IMIRecord, MiUtilService } from "../../services/mi-util.service";

@Injectable(/* {
  providedIn: "root",
} */)
export class SettingsServiceService {
	#miUtil = inject(MiUtilService);

	constructor() {}

	getMiData() {
		return forkJoin({
			languages: this.getLanguages(),
		});
	}

	getLanguages() {
		return this.#miUtil
			.execute("MNS105MI", "LstLng", { LANC: "0" })
			.pipe(map((response) => this.dropdownData(response, "TX40", "LANC")));
	}

	dropdownData(
		response: IMIRecord[] = [],
		labelField: string,
		valueField: string,
	): IdsDropdownOptions {
		return response.map((record) => ({
			label: record[labelField],
			value: record[valueField],
		}));
	}
}

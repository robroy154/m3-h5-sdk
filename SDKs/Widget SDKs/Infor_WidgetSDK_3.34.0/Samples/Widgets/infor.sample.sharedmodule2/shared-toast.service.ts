import { Injectable } from "@angular/core";
import { SohoToastService } from "ids-enterprise-ng";

/**
 * This file is meant to demonstrate and test the scenario
 * where the shared module has a "name" that is different from
 * its' "path".
 *
 * I.e the file name is "shared-toast.service" but the module
 * is imported from "sample-shared-toast-service".
 */
@Injectable({
	providedIn: "root",
})
export class SharedToastService {
	constructor(private toast: SohoToastService) {}

	showToast(title: string, message: string) {
		this.toast.show({
			title,
			message,
			position: "bottom right",
		});
	}
}

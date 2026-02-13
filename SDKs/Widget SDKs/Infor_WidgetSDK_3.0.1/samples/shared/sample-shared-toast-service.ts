import { Injectable, inject } from "@angular/core";
import { SohoToastService } from "ids-enterprise-ng";

@Injectable({
	providedIn: "root",
})
export class SharedToastService {
	private toast = inject(SohoToastService);

	showToast(title: string, message: string) {
		this.toast.show({
			title,
			message,
			position: "bottom right",
		});
	}
}

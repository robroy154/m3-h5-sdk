import { Injectable, inject } from "@angular/core";
import { IWidgetContext, Log } from "@infor-lime/core";

/**
 * This service should be part of the widget component
 * providers array. Since it is provided by the widget component,
 * it will be able to access the widget context that comes with it.
 */
@Injectable()
export class Logger {
	#prefix = inject(IWidgetContext).getStandardWidgetId();

	log(message: string) {
		Log.debug(`[${this.#prefix}] ${message}`);
	}
}

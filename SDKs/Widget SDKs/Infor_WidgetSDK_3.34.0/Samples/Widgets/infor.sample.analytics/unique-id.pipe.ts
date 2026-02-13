import { Pipe, PipeTransform, inject } from "@angular/core";
import { IWidgetContext } from "lime";

/**
 * This pipe is used to generate unique ids for tab panels.
 * By adding the widget instance ID as a suffix, the tabId property
 * can be used without risking ID collisions between multiple widget instances.
 */
@Pipe({
	name: "uniqueId",
	pure: true,
})
export class UniqueIdPipe implements PipeTransform {
	private instanceId = inject(IWidgetContext).getWidgetInstanceId();

	transform(id: string) {
		return `${id}-${this.instanceId}`;
	}
}

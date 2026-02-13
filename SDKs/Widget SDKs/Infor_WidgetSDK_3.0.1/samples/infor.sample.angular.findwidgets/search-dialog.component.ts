import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from "@angular/core";

@Component({
	template: `
		<ids-input
			[label]="searchLabel"
			required
			placeholder="Example: infor.sample.angular.helloworld"
			[value]="query"
			(change)="query = $event.detail.value" />
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SearchDialogComponent {
	@Input() searchLabel: string;
	query: string;
}

import { Component, ViewChild, inject } from "@angular/core";
import { SohoTabsComponent } from "ids-enterprise-ng";
import { IWidgetContext } from "lime";

@Component({
	template: `
		<div soho-tabs (activated)="trackTabActivation($event)">
			<div soho-tab-list-container>
				<ul soho-tab-list>
					<li soho-tab>
						<a soho-tab-title [tabId]="'items' | uniqueId">Items</a>
					</li>
					<li soho-tab>
						<a soho-tab-title [tabId]="'customers' | uniqueId">Customers</a>
					</li>
				</ul>
			</div>
		</div>

		<div soho-tab-panel-container>
			<div soho-tab-panel [tabId]="'items' | uniqueId">
				<button soho-button="primary" trackClick="Track Item">
					Track Item
				</button>
			</div>
			<div soho-tab-panel [tabId]="'customers' | uniqueId">
				<button soho-button="primary" trackClick="Track Customer">
					Track Customer
				</button>
			</div>
		</div>
	`,
})
export class AnalyticsWidgetComponent {
	@ViewChild(SohoTabsComponent) tabs: SohoTabsComponent;

	private context = inject(IWidgetContext);

	trackTabActivation(event: SohoTabsEvent) {
		const tab: HTMLAnchorElement = event.tab;
		const viewName = tab.innerText;
		this.context.trackView({ name: viewName });
	}
}

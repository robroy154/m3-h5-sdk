import { CommonModule } from "@angular/common";
import { Component, Input, NgModule, OnInit } from "@angular/core";
import {
	ILanguage,
	IWidgetComponent,
	IWidgetContext,
	IWidgetInstance,
	Log,
} from "lime";

interface IPerson {
	id: number;
	lastName: string;
	firstName: string;
	title: string;
	status: string;
	anniversary: string;
}

interface IMyLanguage extends ILanguage {
	title?: string;
	status?: string;
	anniversary?: string;
	noContent?: string;
}

@Component({
	template: `
		<div class="twelve columns lm-margin-md-t">
			<div *ngIf="person">
				<h2 class="lm-margin-xl-b">
					{{ person?.id }} - {{ person?.firstName }} {{ person?.lastName }}
				</h2>

				<h3>{{ language?.title }}</h3>
				<p>{{ person?.title }}</p>

				<h3 class="lm-margin-lg-t">{{ language?.status }}</h3>
				<p>{{ person?.status }}</p>

				<h3 class="lm-margin-lg-t">{{ language?.anniversary }}</h3>
				<p>{{ person?.anniversary }}</p>
			</div>

			<p *ngIf="!person">{{ language?.noContent }}</p>
		</div>
	`,
})
export class W2WReceiverComponent implements OnInit, IWidgetComponent {
	@Input() widgetContext: IWidgetContext;
	@Input() widgetInstance: IWidgetInstance;

	person: IPerson;
	language: IMyLanguage;

	private logPrefix: string;

	ngOnInit(): void {
		const widgetContext = this.widgetContext;
		this.language = widgetContext.getLanguage();
		this.logPrefix = `[${widgetContext.getId()}] `;
		this.registerHandler();
	}

	private registerHandler(): void {
		const messageType =
			"samplewidgetcommunication" + this.widgetContext.getPageId();
		this.widgetContext
			.receive(messageType)
			.subscribe((args: IPerson) => this.handleMessage(args));
	}

	private handleMessage(person: IPerson): void {
		if (person) {
			this.person = person;
		}

		Log.debug(
			this.logPrefix +
				"Received message from sender widget: " +
				JSON.stringify(person),
		);
	}
}

@NgModule({
	imports: [CommonModule],
	declarations: [W2WReceiverComponent],
})
export class W2WReceiverModule {}

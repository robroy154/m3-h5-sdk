import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	OnInit,
	inject,
} from "@angular/core";
import { ILanguage, IWidgetContext, Log } from "@infor-lime/core";

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
		<ids-layout-grid padding="md" auto-fit min-col-width="100%">
			@if (person) {
				<ids-layout-grid-cell class="osp-margin-lg-t">
					<ids-text font-size="20"
						>{{ person?.id }} - {{ person?.firstName }}
						{{ person?.lastName }}</ids-text
					>
				</ids-layout-grid-cell>

				<ids-layout-grid-cell class="osp-margin-lg-t">
					<ids-text font-size="16">{{ language?.title }}</ids-text>
					<ids-text font-size="16">{{ person?.title }}</ids-text>
				</ids-layout-grid-cell>

				<ids-layout-grid-cell class="osp-margin-lg-t">
					<ids-text font-size="16">{{ language?.status }}</ids-text>
					<ids-text font-size="16">{{ person?.status }}</ids-text>
				</ids-layout-grid-cell>

				<ids-layout-grid-cell class="osp-margin-lg-t">
					<ids-text font-size="16">{{ language?.anniversary }}</ids-text>
					<ids-text font-size="16">{{ person?.anniversary }}</ids-text>
				</ids-layout-grid-cell>
			}

			@if (!person) {
				<p>{{ language?.noContent }}</p>
			}
		</ids-layout-grid>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class W2WReceiverComponent implements OnInit {
	private widgetContext = inject(IWidgetContext);

	person: IPerson;
	language = this.widgetContext.getLanguage<IMyLanguage>();

	private logPrefix = `[${this.widgetContext.getId()}]`;

	ngOnInit(): void {
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

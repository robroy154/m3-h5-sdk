import {
	CUSTOM_ELEMENTS_SCHEMA,
	ChangeDetectionStrategy,
	Component,
	OnInit,
	computed,
	inject,
	signal,
} from "@angular/core";
import {
	IWidgetContext,
	IWidgetInstance,
	IWidgetSettingMetadata,
	WidgetSettingsType,
} from "@infor-lime/core";
import { mockData } from "./core";

@Component({
	template: `
		<ids-list-view>
			@for (item of items(); track item.title) {
				<ids-list-view-item>
					<ids-text font-weight="bold">{{ item.title }}</ids-text>
					<ids-text font-size="14">{{ item.description }}</ids-text>
				</ids-list-view-item>
			}
		</ids-list-view>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardListComponent implements OnInit {
	private widgetContext = inject(IWidgetContext);
	private widgetInstance = inject(IWidgetInstance);

	sortOrder = signal(this.#sortOrderFromSettings());
	items = computed(() => {
		return [...mockData].sort((a, b) => {
			return this.sortOrder() === "asc"
				? a.title.localeCompare(b.title)
				: b.title.localeCompare(a.title);
		});
	});

	ngOnInit() {
		const instance = this.widgetInstance;
		instance.settingsSaved = () =>
			this.sortOrder.set(this.#sortOrderFromSettings());
		instance.getMetadata = () => this.getMetadata();
	}

	#sortOrderFromSettings() {
		return this.widgetContext.getSettings().get("order", "asc");
	}

	private getMetadata(): IWidgetSettingMetadata[] {
		// Dynamically create metadata for the standard metadata controlled settings UI.
		// For dynamic settings / values that need to be resolved asynchronously,
		// implement IWidgetInstance getMetadataAsync() instead.
		// For known/hardcoded values, place the metadata in the manifest instead.

		return [
			{
				labelId: "order",
				type: WidgetSettingsType.selectorType,
				name: "order",
				defaultValue: this.items().length > 3 ? "asc" : "desc",
				values: [
					{ textId: "ascending", value: "asc" },
					{ textId: "descending", value: "desc" },
				],
			},
		];
	}
}

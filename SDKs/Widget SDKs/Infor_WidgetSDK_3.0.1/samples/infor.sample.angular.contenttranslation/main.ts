import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from "@angular/core";
import {
	ArrayUtil,
	CommonUtil,
	IWidgetContext,
	IWidgetInstance,
	TranslationService,
} from "@infor-lime/core";
import { SohoModalDialogService } from "ids-enterprise-ng";
import { ListItem } from "./core";
import { EditItemComponent } from "./item-dialog";
import { IManifestLanguage } from "./manifest-types";

@Component({
	template: `
		<ids-list-view>
			@for (item of items; track item.title) {
				<ids-list-view-item>
					<ids-layout-flex>
						<ids-layout-flex-item grow="1">
							<ids-text font-weight="semi-bold">{{ getTitle(item) }}</ids-text>
							<ids-text muted>{{ getDescription(item) }}</ids-text>
						</ids-layout-flex-item>
						<ids-layout-flex-item align-self="center">
							<ids-button icon="edit" (click)="onEdit(item)"></ids-button>
							<ids-button icon="delete" (click)="onDelete(item)"></ids-button>
						</ids-layout-flex-item>
					</ids-layout-flex>
				</ids-list-view-item>
			}
		</ids-list-view>
	`,
	imports: [EditItemComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	providers: [SohoModalDialogService],
})
export class ContentTranslationComponent {
	private widgetContext = inject(IWidgetContext);
	private widgetInstance = inject(IWidgetInstance);
	private sohoModalDialogService = inject(SohoModalDialogService);
	private translationService = inject(TranslationService);

	private itemKey = "items";

	items: ListItem[] = this.widgetContext
		.getSettings()
		.get<ListItem[]>(this.itemKey, []);

	private lang = this.widgetContext.getLanguage<IManifestLanguage>();
	private readonly languageCode = this.translationService.getLanguage();

	constructor() {
		this.widgetInstance.actions[0].execute = () => this.onAdd();
		this.widgetInstance.actions[0].text = this.lang.add;
	}

	getTitle(item: ListItem): string {
		return this.getItem(item).title;
	}

	getDescription(item: ListItem): string {
		return this.getItem(item).description;
	}

	onDelete(item: ListItem): void {
		ArrayUtil.remove(this.items, item);
		this.save();
	}

	onEdit(item: ListItem): void {
		this.openDialog(item);
	}

	private onAdd(): void {
		this.openDialog();
	}

	private getItem(item: ListItem): ListItem {
		const translationItem = item.translations
			? item.translations[this.languageCode]
			: null;
		return translationItem || item;
	}

	private addItem(item: ListItem): void {
		this.items.push(item);
		this.save();
	}

	private updateItem(item: ListItem, index: number): void {
		this.items[index] = item;
		this.save();
	}

	private save(): void {
		this.widgetContext.getSettings().set(this.itemKey, this.items);
		this.widgetContext.save();
	}

	private openDialog(item?: ListItem): void {
		const isAdd = !item;
		let existingIndex: number;
		if (isAdd) {
			item = {};
		} else {
			existingIndex = ArrayUtil.indexOf(this.items, item);
			item = CommonUtil.copyJson(item);
		}

		// TODO: Use <ids-modal> instead
		const dialog = this.sohoModalDialogService
			.modal(EditItemComponent)
			.title(this.lang.editItem)
			.afterClose((editItem: ListItem) => {
				if (editItem) {
					if (isAdd) {
						this.addItem(editItem);
					} else {
						this.updateItem(editItem, existingIndex);
					}
				}
			});

		dialog
			.apply((component) => {
				component.dialog = dialog;
				component.parameter = {
					item: item,
				};
			})
			.open();
	}
}

import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	OnInit,
	ViewContainerRef,
	inject,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
	ITranslationResult,
	IWidgetContext,
	TranslationService,
} from "@infor-lime/core";
import { SohoModalDialogRef } from "ids-enterprise-ng";
import { IEditItemParameter, IListItemMap, ListItem } from "./core";
import { IdsInputValueAccessorDirective } from "./ids-value-accessor.directive";
import { IManifestLanguage } from "./manifest-types";

@Component({
	template: `
		<ids-input
			[label]="lang.title"
			required
			[(ngModel)]="item.title"
			[maxlength]="maxTitle" />

		<ids-input
			[label]="lang.description"
			required
			[(ngModel)]="item.description"
			[maxlength]="maxDescription" />

		@if (isTranslation) {
			<ids-button appearance="secondary" (click)="onTranslations()">
				{{ lang.translations }}
			</ids-button>
		}

		<div class="modal-buttonset">
			<button class="btn-modal" (click)="onClose()">{{ lang.cancel }}</button>
			<button
				class="btn-modal-primary no-validation"
				[disabled]="!canSave()"
				(click)="onSave()">
				{{ lang.save }}
			</button>
		</div>
	`,
	imports: [FormsModule, IdsInputValueAccessorDirective],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EditItemComponent implements OnInit {
	private translationService = inject(TranslationService);
	private viewRef = inject(ViewContainerRef);

	lang = inject(IWidgetContext).getLanguage<IManifestLanguage>();

	dialog: SohoModalDialogRef<EditItemComponent>; // TODO: Remove this and use <ids-modal> instead
	parameter: IEditItemParameter;
	item: ListItem = {};
	isTranslation = this.translationService.isEnabled();

	readonly maxTitle = 40;
	readonly maxDescription = 100;

	ngOnInit() {
		this.item = this.parameter.item;
	}

	onClose(): void {
		this.dialog.close();
	}

	onSave(): void {
		this.dialog.close(this.item);
	}

	canSave(): boolean {
		const item = this.item;
		return !!item.title && !!item.description;
	}

	onTranslations(): void {
		const item = this.item;
		const options = {
			view: this.viewRef,
			data: item.translations || {},
			items: [
				{
					name: "title",
					label: this.lang.name,
					labelId: "sample-ct-tr-ttl-lbl",
					valueId: "sample-ct-tr-ttl-v",
					maxLength: this.maxTitle,
					isPrimary: true,
					defaultValue: item.title,
				},
				{
					name: "description",
					label: this.lang.description,
					labelId: "sample-ct-tr-desc-lbl",
					valueId: "sample-ct-tr-desc-v",
					maxLength: this.maxDescription,
					defaultValue: item.description,
				},
			],
		};

		this.translationService.translate(options).subscribe(
			(result: ITranslationResult) => {
				item.translations = result.data as IListItemMap;
			},
			() => {
				// Handle cancel
			},
		);
	}
}

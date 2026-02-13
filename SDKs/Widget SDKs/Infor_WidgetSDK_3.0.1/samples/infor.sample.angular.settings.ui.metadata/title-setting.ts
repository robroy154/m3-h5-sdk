import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	Input,
	OnInit,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IWidgetSettingsContext } from "@infor-lime/core";

/**
 * This component can be used to display a Title setting field with a padlock.
 * It works with the given (required) widgetSettingContext to determine whether title should
 * be locked, unlocked, editable, unlockable etc.
 *
 * Call save() to commit the changes to the widget settings.
 */
@Component({
	selector: "infor-sample-setting-title-field",
	template: `
		<ids-layout-flex align-content="center">
			@if (label) {
				<ids-layout-flex-item align-self="center" class="osp-padding-sm-b">
					<ids-input
						[label]="label"
						[readonly]="!isTitleEditEnabled || isTitleLocked"
						[(ngModel)]="title"
						ngDefaultControl>
					</ids-input>
				</ids-layout-flex-item>

				<ids-layout-flex-item align-self="center">
					<ids-button
						[icon]="lockIcon"
						[disabled]="!isTitleUnlockable"
						(click)="onLockClicked()"></ids-button>
				</ids-layout-flex-item>
			}
		</ids-layout-flex>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [FormsModule],
})
export class TitleSettingComponent implements OnInit {
	@Input() widgetSettingsContext: IWidgetSettingsContext;
	@Input() label: string;

	title: string;
	isTitleEditEnabled: boolean;
	isTitleUnlockable: boolean;
	isTitleLocked: boolean;

	get lockIcon(): string {
		return this.isTitleLocked ? "locked" : "unlocked";
	}

	ngOnInit(): void {
		const widgetContext = this.widgetSettingsContext.getWidgetContext();
		this.isTitleEditEnabled = widgetContext.isTitleEditEnabled();
		this.isTitleLocked = widgetContext.isTitleLocked();
		this.title = widgetContext.getResolvedTitle(this.isTitleLocked);
		this.isTitleUnlockable = widgetContext.isTitleUnlockable();
	}

	/**
	 * Persist changes to the title and lock by saving to widget context.
	 */
	save(): void {
		const widgetContext = this.widgetSettingsContext.getWidgetContext();
		widgetContext.setTitleLocked(this.isTitleLocked);
		if (this.isTitleEditEnabled) {
			widgetContext.setTitle(this.title);
		}
	}

	onLockClicked(): void {
		this.isTitleLocked = !this.isTitleLocked;
		if (this.isTitleLocked) {
			this.title = this.widgetSettingsContext
				.getWidgetContext()
				.getStandardTitle();
		}
	}
}

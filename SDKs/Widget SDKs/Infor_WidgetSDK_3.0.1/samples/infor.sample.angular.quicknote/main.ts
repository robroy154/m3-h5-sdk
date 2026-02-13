import {
	CUSTOM_ELEMENTS_SCHEMA,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	inject,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
	ILanguage,
	IWidgetAction,
	IWidgetContext,
	IWidgetInstance,
} from "@infor-lime/core";

export interface IWidgetLanguge extends ILanguage {
	add: string;
	clear: string;
}

@Component({
	template: `
		@if (notesEnabled) {
			<ids-toolbar>
				<ids-toolbar-section type="fluid">
					<ids-input
						type="text"
						size="full"
						ngDefaultControl
						[(ngModel)]="note" />
				</ids-toolbar-section>

				<ids-toolbar-section align="end">
					<ids-button
						appearance="tertiary"
						[disabled]="!note"
						(click)="addNote(note)">
						{{ lang.add }}
					</ids-button>
				</ids-toolbar-section>
			</ids-toolbar>
		}

		<ids-list-view>
			@for (note of notes; track $index) {
				<ids-list-view-item>
					<ids-text font-size="16" type="h1">{{ note }}</ids-text>
				</ids-list-view-item>
			}
		</ids-list-view>
	`,
	styles: [
		`
			:host {
				display: flex;
				flex-direction: column;

				ids-list-view {
					// height: auto !important;
					flex: 1;
				}

				ids-toolbar {
					height: 44px;
					padding: 0 20px;
					margin-bottom: 6px;
				}
			}

			.toolbar {
			}

			input {
				flex: 1 0 auto;
			}
		`,
	],

	changeDetection: ChangeDetectionStrategy.Default,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [FormsModule],
})
export class QuicknoteComponent implements OnInit {
	private widgetContext = inject(IWidgetContext);
	private widgetInstance = inject(IWidgetInstance);
	private changeDetectorRef = inject(ChangeDetectorRef);

	note: string;
	notes: string[];
	notesEnabled: boolean;
	lang = this.widgetContext.getLanguage<IWidgetLanguge>();

	ngOnInit() {
		this.init();
		this.updateAction();
		this.setCustomTitle();
	}

	addNote(note: string) {
		this.notes = [note, ...this.notes];
		this.widgetInstance.actions[0].isEnabled = this.getIsActionEnabled();
		if (this.notesEnabled) {
			this.widgetContext.save();
		}
		this.note = "";
	}

	clear() {
		this.notes = [];
		this.widgetInstance.actions[0].isEnabled = false;
		this.widgetContext.save();
		this.note = "";
	}

	private init() {
		const settings = this.widgetContext.getSettings();
		this.notes = settings.get("notes");
		this.notesEnabled = settings.isSettingEnabled("notes");
	}

	private updateAction() {
		const customAction = this.widgetInstance.actions[0];
		customAction.execute = () => this.clear();
		customAction.isEnabled = this.getIsActionEnabled();
		customAction.text = this.lang.get("clear");
	}

	private setCustomTitle() {
		const context = this.widgetContext;
		if (context.isTitleEditEnabled()) {
			context.setTitle("QuickNote");
		}
	}

	private getIsActionEnabled(): boolean {
		return this.notesEnabled && !!this.notes.length;
	}
}

export const getActions = (): IWidgetAction[] => {
	return [{ isPrimary: true, standardIconName: "#icon-delete" }];
};

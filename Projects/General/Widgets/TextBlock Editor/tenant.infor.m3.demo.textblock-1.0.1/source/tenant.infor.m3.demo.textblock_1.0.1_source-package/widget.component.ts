/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	AfterViewInit,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	inject,
	OnDestroy,
	OnInit,
	signal,
	ViewChild,
} from "@angular/core";
import { IEmptyStateOptions, WidgetMessageType } from "@infor-lime/core";
import IdsAccordion from "ids-enterprise-wc/components/ids-accordion/ids-accordion";
import IdsEditor from "ids-enterprise-wc/components/ids-editor/ids-editor";
import { IdsMessageSettings } from "ids-enterprise-wc/components/ids-message/ids-message";
import { lastValueFrom, Subscription } from "rxjs";
import { NewTextblockComponent } from "./components/index";
import { EMPTY_STATE } from "./constant/index";
import { WidgetBase } from "./directives/base.directive";
import { Mode, State } from "./enums";
import { TranslatePipe } from "./pipes/demo-translate-pipe";
import { BusinessContextService } from "./services/business-context.service";
import { MiUtilService } from "./services/index";
import { TextBlockParameterService } from "./services/text-block-parameter.service";
import { TextBlockService } from "./services/textblock.service";
import { UserService } from "./services/user.service";
import { ITextBlock } from "./types/text-block.type";

@Component({
	templateUrl: "./widget.component.html",
	styleUrl: "./widget.component.css",
	standalone: true,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [TranslatePipe, NewTextblockComponent],
	providers: [
		TranslatePipe,
		MiUtilService,
		BusinessContextService,
		UserService,
		TextBlockService,
		TextBlockParameterService,
	],
})
export class WidgetComponent
	extends WidgetBase
	implements OnInit, OnDestroy, AfterViewInit
{
	@ViewChild("accordion") accordion?: ElementRef<IdsAccordion>;
	readonly #textBlockService = inject(TextBlockService);

	title = signal(this.widgetContext.getTitle());
	textBlocks = signal<Array<ITextBlock>>([]);
	readonly state = signal(-1);
	editMode = signal(false);
	editingTextVersion = signal<ITextBlock | null>(null);

	contextMap = new Map<string, string>();

	editorEl = document.querySelector<IdsEditor>("#editor-demo")!;

	State = State;
	Mode = Mode;

	private subscriptions = new Subscription();
	private textBlocksSubscription?: Subscription;

	button: SohoEmptyMessageButtonOptions = {
		text: this.lang.get("addTextButton"),
		click: () => {
			this.onNewTextBlock();
		},
	};
	selectedId!: string;
	editEnabled = false;
	deleteEnabled = false;
	compactMode = false;
	autoMode!: boolean;

	async ngOnInit() {
		try {
			this.setBusy(true);
			this.widgetInstance.restored = () =>
				this.widgetContext.setStandardTitle();

			this.initActions();
			this.handleSettings();

			await lastValueFrom(this.ibcService.init());
			/* await lastValueFrom(
				forkJoin([this.ibcService.init(), this.#userService.init()]),
			); */
			this.setEmptyState(State.WaitingForContext);
		} catch (error: any) {
			this.setEmptyState(State.ErrorLoading, "error", error?.message ?? "");
			this.handleError(error);
		}
	}

	ngAfterViewInit() {
		this.subscriptions.add(
			this.ibcService.ibc$.subscribe((data) => {
				this.contextMap = data;
				if (data.size === 0) {
					this.textBlocks.set([]);
					this.setEmptyState(State.WaitingForContext);
				} else {
					this.setTextBlocks();
				}
			}),
		);

		this.widgetInstance.settingsSaved = () => {
			this.handleSettings();
			if (this.contextMap.size && !this.autoMode) {
				this.ibcService.updateKeyValueMap();
			}
			if (this.contextMap.size && this.autoMode) {
				this.ibcService.getByProgram();
			}
		};

		// this.getByProgram();
	}

	ngOnDestroy() {
		this.textBlocksSubscription?.unsubscribe();
		this.ibcService.unregisterMessageHandlers();
		this.subscriptions.unsubscribe();
	}

	/* 	getByProgram() {
		this.subscriptions.add(
			this.#textBlockParameterService.getParByPgm("MMS001").subscribe({
				next: (resp) => {
					this.ibcService.updateKeyValueMap(resp);
				},
				error: (err) => {
					// console.log("err ", err);
				},
			}),
		);
	} */

	updatePrimaryActions() {
		const actions = [
			{
				text: this.lang.get("refresh"),
				standardIconName: "#refresh",
				isPrimary: false,
				optionsSelectable: false,
				isEnabled: true,
				execute: () => this.setTextBlocks(),
			},
		];

		/* 		if (this.contextMap.size && this.editEnabled) {
			actions.push({
				text: this.lang.get("addTextTitle"),
				standardIconName: "#icon-add",
				isPrimary: true,
				optionsSelectable: false,
				isEnabled: true,
				isVisible:
					this.editEnabled &&
					!this.editingTextVersion() &&
					this.contextMap.size,
				execute: () => this.onNewTextBlock(),
			});
		} */
		this.widgetInstance.actions = actions;
		this.widgetContext.updatePrimaryAction();
	}

	setEmptyState(state: State, title?: string, info?: string) {
		this.setBusy(false);
		if (state === State.Ok) {
			this.widgetContext.clearEmptyState();
		} else {
			const defaultState = EMPTY_STATE[state];
			const options: IEmptyStateOptions = {
				title: title ? this.lang.get(title) : this.lang.get(defaultState.title),
				icon: defaultState.icon,
			} as any;

			const description = info || defaultState.info;
			if (description) {
				options.description = this.lang.get(description);
			}

			if (state === State.NoData && this.editEnabled) {
				options.button = this.button;
			}

			this.widgetContext.setEmptyState(options);
		}

		this.updatePrimaryActions();
		this.state.set(state);
	}

	private initActions() {
		if (this.widgetInstance.actions && this.widgetInstance.actions.length > 0) {
			this.widgetInstance.actions[0].execute = () => this.onNewTextBlock();
		}
	}

	onNewTextBlock() {
		this.editingTextVersion.set({} as any);
		this.setEmptyState(State.Ok);
	}

	onEditBlock(block: ITextBlock, event: Event) {
		event.stopPropagation();
		this.editingTextVersion.set(block);
		this.setEmptyState(State.Ok);
	}

	onTextBlockCompleted(textId: string | null) {
		this.editingTextVersion.set(null);
		if (!this.textBlocks()?.length) {
			this.setEmptyState(State.NoData);
		} else {
			this.setEmptyState(State.Ok);
		}

		if (textId) {
			this.selectedId = `${textId}-${this.instanceId}`;
			this.setTextBlocks();
		} else {
			this.expand();
		}
	}

	onDeleteTextBlock(textBlock: ITextBlock) {
		const textBlockId = textBlock.TXVR || textBlock.TX40 || "";
		const messageSettings: IdsMessageSettings = {
			title: this.lang.get("confirmDelete"),
			message: this.lang
				.get("confirmDeleteMessage")
				.replace("{id}", `"${textBlockId}"`),
			status: "warning",
		};

		this.openDeleteMessage(messageSettings).then((deleteConfirmed) => {
			if (deleteConfirmed) {
				this.deleteTextBlock(textBlock);
			}
		});
	}

	deleteTextBlock(textBlock: ITextBlock) {
		this.setBusy(true);
		this.subscriptions.add(
			this.#textBlockService.deleteTextBlockById(textBlock).subscribe({
				next: (resp) => {
					this.setBusy(false);
					const textBlockKey = textBlock.TX40 || textBlock.TXVR || "";
					this.showToast({
						title: this.lang.get("deletedTitle"),
						message: this.lang
							.get("deletedMessage")
							.replace("{id}", `"${textBlockKey}"`),
					});

					this.setTextBlocks();
				},
				error: (err) => {
					const message = err.message ?? "Error deleting text block";
					this.showWidgetMessage(message, WidgetMessageType.Error);
					this.setBusy(false);
				},
			}),
		);
	}

	onDeleteTextLine(textBlock: ITextBlock, line: any, event: Event) {
		event.stopPropagation();
		const lineNo = line?.LINO || "";
		const messageSettings: IdsMessageSettings = {
			title: this.lang.get("confirmDelete"),
			message: `Delete line ${lineNo}?`,
			status: "warning",
		};

		this.openDeleteMessage(messageSettings).then((deleteConfirmed) => {
			if (!deleteConfirmed) return;

			this.setBusy(true);
			this.subscriptions.add(
				this.#textBlockService.deleteTextBlockLine(textBlock, line?.LINO).subscribe({
					next: () => {
						this.setBusy(false);
						this.setTextBlocks();
					},
					error: (err) => {
						const message = err.message ?? "Error deleting text line";
						this.showWidgetMessage(message, WidgetMessageType.Error);
						this.setBusy(false);
					},
				}),
			);
		});
	}

	onAccordionExpanded(event: any) {
		const id = event.target.id;
		this.selectedId = id;
	}

	setExpanded(event: any) {
		const expanded = event.currentTarget.panels.find((panel: any) => {
			return panel.expanded;
		});
		const id = expanded?.id;
		this.selectedId = id;
	}

	expand() {
		setTimeout(() => {
			if (this.accordion && this.selectedId) {
				const panel = this.accordion.nativeElement.panels.find((panel: any) => {
					return panel.id === this.selectedId;
				});
				if (panel) {
					panel.expanded = true;
				}
			}
		}, 1);
	}

	handleSettings() {
		const settings = this.widgetContext.getSettings();
		this.autoMode = settings.get("autoMode", false);
		this.editEnabled = settings.get("editEnabled", false);
		this.deleteEnabled = settings.get("deleteEnabled", false);
		this.compactMode = settings.get("compactMode", false);
	}

	setTextBlocks() {
		this.textBlocksSubscription?.unsubscribe();
		this.setBusy(true);

		this.textBlocksSubscription = this.#textBlockService
			.getAllTextblocks(this.contextMap)
			.subscribe({
				next: (resp) => {
					this.setBusy(false);
					if (resp?.length) {
						this.textBlocks.set(resp);
						this.setEmptyState(State.Ok);
					} else {
						this.textBlocks.set([]);
						this.setEmptyState(State.NoData);
					}

					setTimeout(() => {
						this.expand();
					}, 0);
				},
				error: (err) => {
					this.setEmptyState(State.ErrorLoading);
				},
			});
	}
}

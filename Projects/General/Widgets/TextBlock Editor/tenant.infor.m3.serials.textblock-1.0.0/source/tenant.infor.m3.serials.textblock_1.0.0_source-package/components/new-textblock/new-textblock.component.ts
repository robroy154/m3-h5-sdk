import { CommonModule } from "@angular/common";
import {
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	inject,
	Input,
	OnInit,
	Output,
} from "@angular/core";
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { WidgetMessageType } from "@infor-lime/core";
import { SohoTextAreaModule } from "ids-enterprise-ng";
import { WidgetBase } from "../../directives/base.directive";
import { DemoValueAccessorDirective } from "../../directives/value-accessor.directive";
import { TranslatePipe } from "../../pipes/demo-translate-pipe";
import { TextBlockService } from "../../services/textblock.service";
import type { ITextBlock } from "../../types/text-block.type";
@Component({
	selector: "new-textblock",
	templateUrl: "./new-textblock.component.html",
	styleUrls: ["./new-textblock.component.css"],
	standalone: true,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [
		ReactiveFormsModule,
		DemoValueAccessorDirective,
		SohoTextAreaModule,
		ReactiveFormsModule,
		CommonModule,
		TranslatePipe,
	],
	providers: [TranslatePipe],
})
export class NewTextblockComponent extends WidgetBase implements OnInit {
	private static readonly DEFAULT_TXVR = "Serials";
	private static readonly DEFAULT_TX40 = "Additional Serials";

	@Input() text: string = "";
	@Input() contextMap!: Map<string, string>;
	@Input() textVersion: ITextBlock | any = {};
	@Output() completed = new EventEmitter<string | null>();

	readonly #textBlockService = inject(TextBlockService);
	readonly #fb = inject(FormBuilder);

	form!: FormGroup;

	textValue = "";

	constructor() {
		super();
	}

	ngOnInit(): void {
		this.form = this.createForm();
		this.form.valueChanges.subscribe((value) => {
			// console.log("value ", value);
		});
	}

	private createForm(): FormGroup {
		const formConfig: any = {
			TXVR: [
				this.textVersion?.TXVR ?? NewTextblockComponent.DEFAULT_TXVR,
			],
			TX40: [
				this.textVersion?.TX40 ?? NewTextblockComponent.DEFAULT_TX40,
				Validators.required,
			],
			text: [this.textVersion?.text ?? "", Validators.required],
		};
		return this.#fb.group(formConfig);
	}

	onSaveText(textBlockValues: ITextBlock) {
		const normalizedValues: ITextBlock = {
			...textBlockValues,
			TXVR: NewTextblockComponent.DEFAULT_TXVR,
			TX40: NewTextblockComponent.DEFAULT_TX40,
		};

		this.setBusy(true);
		/* const textblockKeys = {
			PRNO: this.contextMap.get("PRNO") || this.contextMap.get("ITNO") || "",
			MFNO: this.contextMap.get("MFNO") || this.contextMap.get("RIDN") || "",
		}; */

		this.#textBlockService
			.saveTextblock(normalizedValues, this.textVersion?.TXVR)
			.subscribe({
				next: (resp) => {
					this.setBusy(false);
					const result =
						normalizedValues.TXID || normalizedValues.TXVR || null;
					if (resp.length) {
						this.showToast({
							title: "Success",
							message: `Text "${result}" saved`,
						});
						// this.showWidgetMessage("Text saved", WidgetMessageType.Success);
					}
					this.completed.emit(result);
				},
				error: (err) => {
					const message = err.message ?? "Error";
					this.showWidgetMessage(message, WidgetMessageType.Error);
					this.setBusy(false);
				},
			});
	}

	onChange(event: any) {
		const value = event?.target?.value || event?.detail?.value;
		this.form.patchValue({ text: value });
	}

	onSubmit() {
		if (this.form.valid) {
			this.onSaveText(this.form.value);
		}
	}

	get isEditMode(): boolean {
		return Object.keys(this.textVersion).length !== 0;
		// return this.textVersion !== null ;
	}

	get submitButtonText(): string {
		return this.isEditMode ? "update" : "add";
	}

	get textBlockHeaderId(): string {
		return NewTextblockComponent.DEFAULT_TXVR;
	}

	get textBlockHeaderDescription(): string {
		return NewTextblockComponent.DEFAULT_TX40;
	}
}

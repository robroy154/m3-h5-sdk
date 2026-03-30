import {
	AfterViewInit,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	inject,
	Input,
	Output,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { IWidgetContext } from "@infor-lime/core";
import { SohoEditorModule } from "ids-enterprise-ng";
import IdsTextarea from "ids-enterprise-wc/components/ids-textarea/ids-textarea";
import { TranslatePipe } from "../../pipes/demo-translate-pipe";
// import IdsEditor from "ids-enterprise-wc/components/ids-editor/ids-editor";

@Component({
	selector: "text-area-edit",
	templateUrl: "./text-area-edit.component.html",
	styleUrls: ["./text-area-edit.component.css"],
	imports: [SohoEditorModule, TranslatePipe],
	providers: [TranslatePipe],
	standalone: true,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TextAreaEditComponent implements AfterViewInit {
	/* 	@ViewChild(SohoEditorComponent, { static: false, read: SohoEditorComponent })
	editor?: SohoEditorComponent; */
	@Input() textVersion!: any;
	@Input() index!: number;
	@Output() textChange = new EventEmitter<string>();
	@Output() saveText = new EventEmitter<any>();
	@Output() cancelEdit = new EventEmitter<void>();
	// text: string = "";
	readonly #context = inject(IWidgetContext);
	readonly #lang = inject(TranslatePipe);
	readonly #sanitizer = inject(DomSanitizer);

	instanceId: string = this.#context.getWidgetInstanceId();
	public model: any = {
		editorText: this.#sanitizer
			.bypassSecurityTrustHtml(`<p>Embrace <a href="http://en.wikipedia.org/wiki/e-commerce" class="hyperlink">e-commerce action-items</a>, reintermediate, ecologies paradigms wireless share life-hacks create innovative harness. Evolve solutions rich-clientAPIs synergies harness relationships virtual vertical facilitate end-to-end, wireless, evolve synergistic synergies.</p>
              <p>Cross-platform, evolve, ROI scale cultivate eyeballs addelivery, e-services content cross-platform leverage extensible viral incentivize integrateAJAX-enabled sticky evolve magnetic cultivate leverage; cutting-edge. Innovate, end-to-end podcasting, whiteboard streamline e-business social; compelling, "cross-media exploit infomediaries innovative integrate integrateAJAX-enabled." Killer interactive reinvent, cultivate widgets leverage morph.</p>`),
	};

	ngAfterViewInit(): void {
		// this.textEditor.value = this.text;
		/* 	this.editor?.change.subscribe((event: any) => {
			this.onChange(event);
		}); */
		const firstDiv = this.textEditor.querySelector("div");
		if (firstDiv) {
			// firstDiv.classList.remove("editor-container");
			firstDiv.classList.add("editor");
			firstDiv.style.margin = "0";
		}

		const formattedText = this.textVersion.text?.replace(/<br>/g, "\n");

		this.textEditor.value = formattedText;

		/* 	this.textEditor.addEventListener("change", (event: any) => {
			this.onChange(event);
		}); */

		this.textEditor.addEventListener("keydown", (event: any) => {
			this.onKeyDown(event);
			if (event.key === "Backspace") {
				this.textEditor.render();
				// this.textEditor.value = formattedText;
			}
		});
	}

	get textEditor(): IdsTextarea {
		return document.querySelector<IdsTextarea>(
			`#editor-demo${this.instanceId}${this.index}`,
		)!;
	}

	onKeyDown(event: any) {
		// console.log("event ", event);
	}

	onContentChange(event: any) {}

	onChange(event: any) {
		// this.textEditor.

		if (this.textVersion.text === undefined) return;
		const value = event?.detail?.value;
		this.textChange.emit(value);

		// this.textEditor.innerHTML = value;

		this.model.editorText = value;
	}

	onGenerateAi(event: any) {}

	onUpdated(event: any) {}

	onSave() {
		// console.log("this.textEditor.value ", this.textEditor.value);

		const text = this.textEditor.value;
		const textVersion = { ...this.textVersion, ...{ text } };
		this.saveText.emit(textVersion);
	}

	onCancel() {
		this.cancelEdit.emit();
	}
}

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
import IdsEditor from "ids-enterprise-wc/components/ids-editor/ids-editor";
// import IdsEditor from "ids-enterprise-wc/components/ids-editor/ids-editor";

@Component({
	selector: "text-edit",
	templateUrl: "./text-edit.component.html",
	styleUrls: ["./text-edit.component.css"],
	imports: [SohoEditorModule],
	standalone: true,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TextEditComponent implements AfterViewInit {
	/* 	@ViewChild(SohoEditorComponent, { static: false, read: SohoEditorComponent })
	editor?: SohoEditorComponent; */
	@Input() text!: string;
	@Input() index!: number;
	@Output() textChange = new EventEmitter<string>();
	@Output() saveText = new EventEmitter<string>();
	// text: string = "";
	readonly #context = inject(IWidgetContext);
	instanceId: string = "";
	public model: any;

	constructor(sanitizer: DomSanitizer) {
		this.instanceId = this.#context.getWidgetInstanceId();

		this.model = {
			editorText:
				sanitizer.bypassSecurityTrustHtml(`<p>Embrace <a href="http://en.wikipedia.org/wiki/e-commerce" class="hyperlink">e-commerce action-items</a>, reintermediate, ecologies paradigms wireless share life-hacks create innovative harness. Evolve solutions rich-clientAPIs synergies harness relationships virtual vertical facilitate end-to-end, wireless, evolve synergistic synergies.</p>
              <p>Cross-platform, evolve, ROI scale cultivate eyeballs addelivery, e-services content cross-platform leverage extensible viral incentivize integrateAJAX-enabled sticky evolve magnetic cultivate leverage; cutting-edge. Innovate, end-to-end podcasting, whiteboard streamline e-business social; compelling, "cross-media exploit infomediaries innovative integrate integrateAJAX-enabled." Killer interactive reinvent, cultivate widgets leverage morph.</p>`),
		};
	}

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

		this.textEditor.value = this.text;
	}

	get textEditor(): IdsEditor {
		return document.querySelector<IdsEditor>(
			`#editor-demo${this.instanceId}${this.index}`,
		)!;
	}

	onContentChange(event: any) {}

	onChange(event: any) {
		// this.textEditor.

		if (this.text === undefined) return;
		const value = event?.detail?.value;
		this.textChange.emit(value);

		// this.textEditor.innerHTML = value;
		this.model.editorText = value;
	}

	onGenerateAi(event: any) {}

	onUpdated(event: any) {}
}

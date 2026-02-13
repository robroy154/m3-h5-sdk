import { Component, OnInit } from "@angular/core";
import { ComponentBase } from "./base.component";

@Component({
	selector: "ids-textarea",
	template: ` <div class="field">
		<label soho-label [required]="true" [attr.data-lmw-id]="autoId + '-label'">
			Textarea
			<br />
			ngModel: {{ model }}
		</label>
		<textarea
			soho-textarea
			class="smalltextarea"
			maxlength="100"
			[(ngModel)]="model"
			data-validate="required"
			[disabled]="disabled"
			[attr.data-lmw-id]="autoId"></textarea>
	</div>`,
	styles: [
		`
			.smalltextarea {
				max-width: 100% !important;
			}
		`,
	],
})
export class TextareaComponent extends ComponentBase implements OnInit {
	ngOnInit() {
		this.model = this.setDefaultValue
			? "This textarea has a default text"
			: undefined;
	}
}

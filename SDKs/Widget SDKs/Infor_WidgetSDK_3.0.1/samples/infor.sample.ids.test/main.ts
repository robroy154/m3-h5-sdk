import {
	Component,
	Input,
	OnInit,
	ViewContainerRef,
	inject,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
	IWidgetContext,
	IWidgetInstance,
	Mode,
	SubMode,
} from "@infor-lime/core";
import {
	SohoButtonModule,
	SohoInputModule,
	SohoInputValidateModule,
	SohoLabelModule,
	SohoModalDialogService,
} from "ids-enterprise-ng";
import { AutocompleteComponent } from "./components/autocomplete.component";
import { CheckboxComponent } from "./components/checkbox.component";
import { ColorpickerComponent } from "./components/colorpicker.component";
import { DatepickerComponent } from "./components/datepicker.component";
import { DropdownComponent } from "./components/dropdown.component";
import { InputComponent } from "./components/input.component";
import { LookupDatasetComponent } from "./components/lookup.dataset.component";
import { LookupSourceComponent } from "./components/lookup.source.component";
import { MultiselectComponent } from "./components/multiselect.component";
import { RadiobuttonComponent } from "./components/radiobutton.component";
import { TextareaComponent } from "./components/textarea.component";
import { TimepickerComponent } from "./components/timepicker.component";

@Component({
	selector: "test-ids-components",
	template: `
		<div class="row lm-padding-lg-t">
			<div class="three columns">
				<test-ids-input
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-input'"></test-ids-input>
			</div>
			<div class="three columns">
				<test-ids-dropdown
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-dropdown'"></test-ids-dropdown>
			</div>
			<div class="three columns">
				<test-ids-multiselect
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-multiselect'"></test-ids-multiselect>
			</div>
			<div class="three columns">
				<test-ids-autocomplete
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-autocomplete'"></test-ids-autocomplete>
			</div>
		</div>
		<div class="row">
			<div class="three columns">
				<test-ids-dataset-lookup
					[isMulti]="false"
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-lookup-dss'"></test-ids-dataset-lookup>
			</div>
			<div class="three columns">
				<test-ids-dataset-lookup
					[isMulti]="true"
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-lookup-dms'"></test-ids-dataset-lookup>
			</div>
			<div class="three columns">
				<test-ids-dataset-lookup
					[isMulti]="false"
					[isAsync]="true"
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-lookup-ads'"></test-ids-dataset-lookup>
			</div>
			<div class="three columns">
				<test-ids-dataset-lookup
					[isMulti]="true"
					[isAsync]="true"
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-lookup-adm'"></test-ids-dataset-lookup>
			</div>
		</div>
		<div class="row">
			<div class="three columns">
				<test-ids-source-lookup
					[isMulti]="false"
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-lookup-sss'"></test-ids-source-lookup>
			</div>
			<div class="three columns">
				<test-ids-source-lookup
					[isMulti]="true"
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-lookup-sms'"></test-ids-source-lookup>
			</div>
			<div class="three columns">
				<test-ids-source-lookup
					[isMulti]="false"
					[isAsync]="true"
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-lookup-ass'"></test-ids-source-lookup>
			</div>
			<div class="three columns">
				<test-ids-source-lookup
					[isMulti]="true"
					[isAsync]="true"
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-lookup-asm'"></test-ids-source-lookup>
			</div>
		</div>
		<div class="row">
			<div class="three columns">
				<test-ids-colorpicker
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-color'"></test-ids-colorpicker>
			</div>
			<div class="three columns">
				<test-ids-datepicker
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-date'"></test-ids-datepicker>
			</div>
			<div class="three columns">
				<test-ids-datepicker
					[withTime]="true"
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-date-time'"></test-ids-datepicker>
			</div>
			<div class="three columns">
				<test-ids-timepicker
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-time'"></test-ids-timepicker>
			</div>
		</div>
		<div class="row">
			<div class="three columns">
				<test-ids-radiobutton
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-radio'"></test-ids-radiobutton>
			</div>
			<div class="three columns">
				<test-ids-checkbox
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-cb'"></test-ids-checkbox>
			</div>
			<div class="three columns">
				<test-ids-textarea
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-textarea'"></test-ids-textarea>
			</div>
			<div class="three columns">
				<div class="field">
					<label
						name="lm-tst-smp-input-label"
						style="margin-bottom: 22px;"
						soho-label
						[required]="true"
						data-lm-tst-smp="in-lbl"
						>Link</label
					>
					<input
						name="lm-tst-smp-input"
						soho-input
						[(ngModel)]="link"
						data-validate="required"
						[disabled]="disableAll"
						data-lm-tst-smp="in-ipt" />
				</div>
				<div class="field">
					<button
						soho-button="secondary"
						[attr.data-lmw-id]="autoId + '-launch'"
						[disabled]="disableAll"
						(click)="launchLink()">
						Launch
					</button>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="field lm-margin-lg-l">
				<button
					soho-button="secondary"
					(click)="disableAll = !disableAll"
					[attr.data-lmw-id]="autoId + '-disable'">
					{{ (disableAll ? "Enable" : "Disable") + " all components" }}
				</button>
			</div>
		</div>
		<div class="row">
			<div class="field">
				<div class="lm-margin-lg-l" [attr.data-lmw-id]="autoId + '-modeinfo'">
					Mode : {{ modeInfo }}, SubMode: {{ subModeInfo }}
				</div>
			</div>
		</div>
		<div class="row">
			<div class="field">
				<div
					class="lm-margin-lg-l"
					[attr.data-lmw-id]="autoId + '-ishomepages'">
					Is in Homepages: {{ isInApp("homepages") }}
				</div>
				<div class="lm-margin-lg-l" [attr.data-lmw-id]="autoId + '-isportal'">
					Is in Portal: {{ isInApp("portal") }}
				</div>
			</div>
		</div>
	`,
	providers: [SohoModalDialogService],
	imports: [
		InputComponent,
		DropdownComponent,
		MultiselectComponent,
		AutocompleteComponent,
		LookupDatasetComponent,
		LookupSourceComponent,
		ColorpickerComponent,
		DatepickerComponent,
		TimepickerComponent,
		RadiobuttonComponent,
		CheckboxComponent,
		TextareaComponent,
		SohoLabelModule,
		SohoInputModule,
		SohoInputValidateModule,
		ReactiveFormsModule,
		FormsModule,
		SohoButtonModule,
	],
})
export class IDSTestComponent implements OnInit {
	private widgetContext = inject(IWidgetContext);
	private widgetInstance = inject(IWidgetInstance);
	private dialogService = inject(SohoModalDialogService);
	private viewRef = inject(ViewContainerRef);

	@Input() openedAsModal = false;
	@Input() setDefaultValues = false;

	modeInfo = "";
	subModeInfo = "";
	autoId = "";

	link = "?favoriteContext=inforos&type=SiteGuid";

	disableAll = false;

	ngOnInit() {
		if (!this.openedAsModal) {
			this.widgetInstance.actions[0].execute = () => this.openModal();
			this.widgetInstance.actions[1].execute = () => this.openModal(true);
		}

		this.initializeModeAndAutoIdInfo();
	}

	isInApp(app: "homepages" | "portal"): "Yes" | "No" | "Unknown" {
		if (app === "homepages") {
			const isHomepages = this.widgetContext.isHomepages;
			if (typeof isHomepages === "function") {
				return isHomepages() ? "Yes" : "No";
			}
			return "Unknown";
		}
		const isPortal = this.widgetContext.isPortal;
		if (typeof isPortal === "function") {
			return isPortal() ? "Yes" : "No";
		}
		return "Unknown";
	}

	openModal(setDefaultValues = false) {
		const dialog = this.dialogService.modal(IDSTestComponent, this.viewRef);

		dialog
			.options({
				buttons: [
					{
						text: "Cancel",
						id: `${this.autoId}-cancel`,
						click: () => dialog.close(),
					},
					{
						text: "OK",
						id: `${this.autoId}-ok`,
						click: () => dialog.close(),
						isDefault: true,
					},
				],
				title: "Modal",
				id: `${this.autoId}-modal`,
			})
			.apply((component: IDSTestComponent) => {
				component.openedAsModal = true;
				component.setDefaultValues = setDefaultValues;
			})
			.open();
	}

	launchLink() {
		this.widgetContext.launch({ url: this.link, resolve: true });
	}

	private initializeModeAndAutoIdInfo(): void {
		const mode = this.widgetContext.getMode();
		this.modeInfo = this.getDisplayTextMode(mode) + " (" + mode + ")";

		const subMode = this.widgetContext.getSubMode();
		this.subModeInfo =
			this.getDisplayTextSubMode(subMode) + " (" + subMode + ")";
		this.autoId = "infor.sample.ids.test"; // -mode" + mode + subMode
		if (this.openedAsModal) {
			this.autoId += "-modal";
		}
	}

	private getDisplayTextMode(mode: Mode): string {
		if (mode === Mode.Default) {
			return "Default";
		}
		if (mode === Mode.ContextApp) {
			return "ContextApp";
		}
		if (mode === Mode.Mobile) {
			return "Mobile";
		}
		return "";
	}

	private getDisplayTextSubMode(subMode: SubMode): string {
		if (subMode === SubMode.Default) {
			return "Default";
		}
		if (subMode === SubMode.MobilePage) {
			return "MobilePage";
		}
		if (subMode === SubMode.MobileSingle) {
			return "MobileSingle";
		}
		return "";
	}
}

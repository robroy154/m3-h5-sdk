import { CommonModule } from "@angular/common";
import {
	Component,
	Input,
	NgModule,
	OnInit,
	ViewContainerRef,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
	SohoComponentsModule,
	SohoModalDialogService,
} from "@infor/sohoxi-angular";
import {
	IWidgetComponent,
	IWidgetContext,
	IWidgetInstance,
	Mode,
	SubMode,
} from "lime";
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
import { IDSModalComponent } from "./modal";

@Component({
	selector: "ids-components",
	template: `
		<div class="row lm-padding-lg-t">
			<div class="three columns">
				<ids-input
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-input'"></ids-input>
			</div>
			<div class="three columns">
				<ids-dropdown
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-dropdown'"></ids-dropdown>
			</div>
			<div class="three columns">
				<ids-multiselect
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-multiselect'"></ids-multiselect>
			</div>
			<div class="three columns">
				<ids-autocomplete
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-autocomplete'"></ids-autocomplete>
			</div>
		</div>
		<div class="row">
			<div class="three columns">
				<ids-dataset-lookup
					[isMulti]="false"
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-lookup-dss'"></ids-dataset-lookup>
			</div>
			<div class="three columns">
				<ids-dataset-lookup
					[isMulti]="true"
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-lookup-dms'"></ids-dataset-lookup>
			</div>
			<div class="three columns">
				<ids-dataset-lookup
					[isMulti]="false"
					[isAsync]="true"
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-lookup-ads'"></ids-dataset-lookup>
			</div>
			<div class="three columns">
				<ids-dataset-lookup
					[isMulti]="true"
					[isAsync]="true"
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-lookup-adm'"></ids-dataset-lookup>
			</div>
		</div>
		<div class="row">
			<div class="three columns">
				<ids-source-lookup
					[isMulti]="false"
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-lookup-sss'"></ids-source-lookup>
			</div>
			<div class="three columns">
				<ids-source-lookup
					[isMulti]="true"
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-lookup-sms'"></ids-source-lookup>
			</div>
			<div class="three columns">
				<ids-source-lookup
					[isMulti]="false"
					[isAsync]="true"
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-lookup-ass'"></ids-source-lookup>
			</div>
			<div class="three columns">
				<ids-source-lookup
					[isMulti]="true"
					[isAsync]="true"
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-lookup-asm'"></ids-source-lookup>
			</div>
		</div>
		<div class="row">
			<div class="three columns">
				<ids-colorpicker
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-color'"></ids-colorpicker>
			</div>
			<div class="three columns">
				<ids-datepicker
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-date'"></ids-datepicker>
			</div>
			<div class="three columns">
				<ids-datepicker
					[withTime]="true"
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-date-time'"></ids-datepicker>
			</div>
			<div class="three columns">
				<ids-timepicker
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-time'"></ids-timepicker>
			</div>
		</div>
		<div class="row">
			<div class="three columns">
				<ids-radiobutton
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-radio'"></ids-radiobutton>
			</div>
			<div class="three columns">
				<ids-checkbox
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-cb'"></ids-checkbox>
			</div>
			<div class="three columns">
				<ids-textarea
					[setDefaultValue]="setDefaultValues"
					[disabled]="disableAll"
					[autoId]="autoId + '-textarea'"></ids-textarea>
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
})
export class IDSTestComponent implements IWidgetComponent, OnInit {
	@Input() widgetContext: IWidgetContext;
	@Input() widgetInstance: IWidgetInstance;
	@Input() openedAsModal = false;
	@Input() setDefaultValues = false;
	modeInfo = "";
	subModeInfo = "";
	autoId = "";

	link = "?favoriteContext=inforos&type=SiteGuid";

	disableAll = false;

	constructor(
		private readonly dialogService: SohoModalDialogService,
		private readonly viewRef: ViewContainerRef,
	) {}

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
		const dialog = this.dialogService
			.modal(IDSModalComponent, this.viewRef)
			.title("Modal")
			.id(this.autoId + "-modal");

		dialog
			.apply((component: IDSModalComponent) => {
				component.modalRef = dialog;
				component.setDefaultValues = setDefaultValues;
				component.widgetContext = this.widgetContext;
				component.widgetInstance = this.widgetInstance;
				component.autoId = this.autoId + "-modal";
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

@NgModule({
	imports: [CommonModule, FormsModule, SohoComponentsModule],
	declarations: [
		IDSTestComponent,
		IDSModalComponent,
		DropdownComponent,
		InputComponent,
		MultiselectComponent,
		CheckboxComponent,
		LookupDatasetComponent,
		RadiobuttonComponent,
		TextareaComponent,
		LookupSourceComponent,
		TimepickerComponent,
		ColorpickerComponent,
		DatepickerComponent,
		AutocompleteComponent,
	],
})
export class IDSTestModule {}

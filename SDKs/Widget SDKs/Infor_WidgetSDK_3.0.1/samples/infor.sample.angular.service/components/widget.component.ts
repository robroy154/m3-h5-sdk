import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	ElementRef,
	ViewChild,
	inject,
} from "@angular/core";
import { IWidgetContext } from "@infor-lime/core";
import IdsModal from "ids-enterprise-wc/components/ids-modal/ids-modal";
import { SharedCounterService } from "../services/shared-counter.service";
import { GlobalCounterComponent } from "./global-counter.component";
import { LocalCounterComponent } from "./local-counter.component";
import { SharedCounterComponent } from "./shared-counter.component";

@Component({
	template: `
		<ids-layout-grid cols="12">
			<ids-layout-grid-cell col-span="12">
				<global-counter></global-counter>
			</ids-layout-grid-cell>

			<ids-layout-grid-cell col-span="6">
				<shared-counter></shared-counter>
			</ids-layout-grid-cell>

			<ids-layout-grid-cell col-span="6">
				<shared-counter></shared-counter>
			</ids-layout-grid-cell>

			<ids-layout-grid-cell col-span="6">
				<local-counter></local-counter>
			</ids-layout-grid-cell>

			<ids-layout-grid-cell col-span="6">
				<local-counter></local-counter>
			</ids-layout-grid-cell>

			<ids-layout-grid-cell col-span="12" class="center-button">
				<ids-button appearance="tertiary" (click)="openDialog()">
					Open Dialog
				</ids-button>
			</ids-layout-grid-cell>
		</ids-layout-grid>

		<ids-modal #customModal click-outside-to-close="true">
			<ids-text slot="title" font-size="24" type="h2">
				{{ widgetTitle }}
			</ids-text>
			<ids-layout-grid cols="12" padding-x="sm">
				<ids-layout-grid-cell col-span="12">
					<ids-text>
						This component is created outside the widget component tree, so it
						has to provide its own SharedCounterService. It will only share
						state with the rest of the widget (and other widget instances)
						through the GlobalCounterService.
					</ids-text>
				</ids-layout-grid-cell>

				<ids-layout-grid-cell col-span="12">
					<global-counter></global-counter>
				</ids-layout-grid-cell>

				<ids-layout-grid-cell col-span="6">
					<shared-counter></shared-counter>
				</ids-layout-grid-cell>

				<ids-layout-grid-cell col-span="6">
					<shared-counter></shared-counter>
				</ids-layout-grid-cell>

				<ids-layout-grid-cell col-span="6">
					<local-counter></local-counter>
				</ids-layout-grid-cell>

				<ids-layout-grid-cell col-span="6">
					<local-counter></local-counter>
				</ids-layout-grid-cell>
			</ids-layout-grid>
		</ids-modal>
	`,
	styles: [
		`
			.center-button {
				display: flex;
				justify-content: center;
			}
		`,
	],

	providers: [SharedCounterService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [
		GlobalCounterComponent,
		SharedCounterComponent,
		LocalCounterComponent,
	],
})
export class WidgetComponent {
	private widgetContext = inject(IWidgetContext);

	@ViewChild("customModal") customModal: ElementRef<IdsModal>;
	widgetTitle = this.widgetContext.getTitle();

	openDialog() {
		this.customModal.nativeElement.show();
	}
}

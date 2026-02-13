/**
 * This is a sample widget which can be minified.
 *
 * Addtional information about minification can be found in the
 * /Samples/ReadMe.md and /Documentation/DevelopersGuide.pdf files.
 *
 * When developing your own widget, which you want to minify, the following prerequisites are needed:
 *
 * Your structure should look something like this [Example top folder name = my.widget.top.folder.name]
 * my.widget.id.folder.name/
 * my.widget.id.folder.name/widget.ts
 * my.widget.id.folder.name/widget.manifest
 *
 * Option files for Angular and AOT
 * my.widget.id.folder.name/widget-aot.ts
 * my.widget.id.folder.name/main.ts
 *
 * Please note that images are no longer supported to be in a folder. Code files can still be in subdirectories as they
 * will be bundled, but images must be in the root level. The Homepages framework will no longer support directories for
 * images.
 *
 * Specific content that is needed are marked REQUIRED in files
 * [widget.ts] (read comments in file for the specifics)
 *
 * When you have added all the needed changes based on the comments you are ready to minify your widget.
 *
 * The following preparation steps are only required once and you may already have done these steps previously.
 * If you have updated the Homepages SDK you should always perform this step again.
 *
 * 1. Open a command window in the Samples directory.
 * 2. Verify that Node.js is installed by running the command "node -v". Install Node.js if missing.
 * 3. Install the Node.js dependencies using the command "npm install", on Windows you can also run "Install.cmd"
 *
 * A widget can be minified and a package will be created using the following step:
 * 1. Run the homepages script with the command pack to bundle and minify the widget, and create a production zip file.
 *
 * node homepages pack --widget "infor.sample.minify"
 *
 * The output of the final command is a widget zip file with a name such as:
 * ./Build/infor_sample_minify_1_0_20170305_073216.zip
 */

import { NgClass } from "@angular/common";
import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	OnInit,
	ViewContainerRef,
	inject,
} from "@angular/core";
import {
	IDialogResult,
	IWidgetAction,
	IWidgetContext,
	IWidgetInstance,
	Log,
} from "@infor-lime/core";
import { SohoModalDialogService } from "ids-enterprise-ng";
import { IMyDialogParameters, MyDialogComponent } from "./dialog/dialog";

@Component({
	template: `
		<div class="infor-sample-minify-widget">
			<div class="lm-text-align-c">
				<ids-button [icon]="buttonIcon" (click)="toggleClass()"></ids-button>
				{{ buttonMessage }}
			</div>
			<div>
				<img class="merge" src="{{ topIcon }}" [ngClass]="{ show: show }" />
				<img class="merge" src="{{ middleIcon }}" [ngClass]="{ show: show }" />
				<img class="merge" src="{{ bottomIcon }}" [ngClass]="{ show: show }" />
			</div>
		</div>
	`,
	styles: [
		`
			.infor-sample-minify-widget .merge {
				display: inline;
				margin-bottom: 5px;
			}
			.infor-sample-minify-widget .merge.show {
				display: block;
				margin-bottom: 0;
			}
		`,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [NgClass],
})
export class MinifySampleComponent implements OnInit {
	private widgetContext = inject(IWidgetContext);
	private widgetInstance = inject(IWidgetInstance);
	private sohoDialogService = inject(SohoModalDialogService);
	private viewRef = inject(ViewContainerRef);

	/*
	 * REQUIRED for image resources
	 *
	 * When minifying a widget, resources will be copied such as (.png, .jpg, .gif)
	 * When you are using such resources you must use the
	 * this.widgetContext.getUrl() function to reference the resources.
	 */
	topIcon = this.widgetContext.getUrl("/top.png");
	middleIcon = this.widgetContext.getUrl("/middle.png");
	bottomIcon = this.widgetContext.getUrl("/bottom.png");
	buttonIcon = "maximize";
	buttonMessage = "Divide images";
	show = true;

	ngOnInit(): void {
		this.widgetInstance.actions[0].execute = () => this.createDialog();
	}

	toggleClass(): void {
		if (this.show) {
			this.show = false;
			this.buttonMessage = "Combine images";
			this.buttonIcon = "minimize";
		} else {
			this.show = true;
			this.buttonMessage = "Divide images";
			this.buttonIcon = "maximize";
		}
	}

	private createDialog() {
		const myParameters: IMyDialogParameters = {
			topIcon: this.topIcon,
			middleIcon: this.middleIcon,
			bottomIcon: this.bottomIcon,
		};

		const dialog = this.sohoDialogService
			.modal(MyDialogComponent, this.viewRef)
			.title("My dialog")
			.afterClose((result: IDialogResult) => {
				Log.debug("Dialog result:", result);
			});

		dialog
			.apply((component) => {
				component.dialog = dialog;
				component.parameters = myParameters;
			})
			.open();
	}
}

export const getActions = (): IWidgetAction[] => {
	return [
		{
			isPrimary: true,
			standardIconName: "#icon-add",
			text: "Open Dialog",
		},
	];
};

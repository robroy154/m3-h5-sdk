import {
	AfterViewInit,
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	OnInit,
	inject,
} from "@angular/core";
import { IWidgetContext, IWidgetInstance } from "@infor-lime/core";
import IdsDataGrid from "ids-enterprise-wc/components/ids-data-grid/ids-data-grid";
import { IdsDataGridColumn } from "ids-enterprise-wc/components/ids-data-grid/ids-data-grid-column";

@Component({
	template: `
		<ids-layout-flex full-height>
			<ids-layout-flex-item>
				<ids-data-grid
					auto-fit="true"
					id="settings-data-grid-{{ id }}"></ids-data-grid>
			</ids-layout-flex-item>
		</ids-layout-flex>
	`,
	styles: `
		:host {
			display: flex;
			justify-content: center;
			align-items: center;
			overflow: hidden;
			height: 100%;

			ids-layout-flex {
				margin-top: 40px;
			}
		}
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HelloWorldComponent implements OnInit, AfterViewInit {
	private widgetContext = inject(IWidgetContext);
	private widgetInstance = inject(IWidgetInstance);

	message: string;
	id: string;
	columns: IdsDataGridColumn[] = [];

	dataGrid: IdsDataGrid;
	ngOnInit() {
		this.id = this.widgetContext.getWidgetInstanceId();
	}

	ngAfterViewInit(): void {
		this.dataGrid = document.querySelector<IdsDataGrid>(
			"#settings-data-grid-" + this.id,
		);

		this.columns.push({
			id: "setting",
			name: "Setting",
			field: "setting",
			formatter: this.dataGrid.formatters.text,
		});
		this.columns.push({
			id: "value",
			name: "Value",
			field: "value",
			formatter: this.dataGrid.formatters.text,
		});

		this.dataGrid.columns = this.columns;

		this.widgetContext.receive("inforWorkspaceContext").subscribe({
			next: (message: any) => {
				const list = message.settings;
				const dataset = [];
				for (const [key, value] of Object.entries(list)) {
					dataset.push({ setting: key, value: value });
				}
				this.dataGrid.data = dataset;
			},
		});
	}
}

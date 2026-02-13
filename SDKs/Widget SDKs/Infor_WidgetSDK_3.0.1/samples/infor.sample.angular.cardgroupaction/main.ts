import {
	CUSTOM_ELEMENTS_SCHEMA,
	ChangeDetectionStrategy,
	Component,
	OnInit,
	inject,
} from "@angular/core";
import { IWidgetContext } from "@infor-lime/core";
import { Category, ICardItem, mockData } from "./core";
import { CategoryFilterPipe } from "./pipes";

@Component({
	template: `
		<div class="card-group-action">
			<ids-toolbar>
				<ids-toolbar-section type="buttonset" align="end">
					<ids-menu-button
						icon="filter"
						menu="filtermenu-{{ widgetInstanceId }}">
						<span>{{ selectedCategory }}</span>
					</ids-menu-button>
					<ids-popup-menu id="filtermenu-{{ widgetInstanceId }}">
						<ids-menu-group>
							@for (category of categories; track category) {
								<ids-menu-item (click)="setCategory(category)">
									{{ category }}
								</ids-menu-item>
							}
						</ids-menu-group>
					</ids-popup-menu>
				</ids-toolbar-section>
			</ids-toolbar>
		</div>
		<ids-list-view>
			@for (item of items | filterBy: selectedCategory; track item.title) {
				<ids-list-view-item>
					<ids-text font-weight="semi-bold">{{ item.title }}</ids-text>
					<ids-text>{{ item.description }}</ids-text>
				</ids-list-view-item>
			}
		</ids-list-view>
	`,
	styles: [
		`
			:host {
				height: 100%;
				display: flex;
				flex-direction: column;
			}

			ids-list-view {
				overflow: auto;
				flex: 1 1 auto;
			}
		`,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [CategoryFilterPipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardGroupActionComponent implements OnInit {
	private widgetContext = inject(IWidgetContext);

	items: ICardItem[] = [];
	categories = [Category.All, Category.Customer, Category.Warehouse];
	selectedCategory = Category.All;
	widgetInstanceId: string;

	ngOnInit() {
		this.items = mockData;
		this.widgetInstanceId = this.widgetContext.getWidgetInstanceId();
	}

	setCategory(category: Category) {
		this.selectedCategory = category;
	}
}

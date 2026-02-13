import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	OnInit,
	inject,
} from "@angular/core";
import {
	BusyStateOptions,
	BusyStatePosition,
	EmptyStateIcon,
	IWidgetContext,
	IWidgetInstance,
	WidgetState,
} from "@infor-lime/core";
import { ListService } from "./list.service";
import { ScrollDirective } from "./scroll.directive";
import { Task } from "./task";

@Component({
	template: `
		@if (tasks.length) {
			<ids-list-view observeScroll (scrollBottom)="loadMore()">
				@for (task of tasks; track task) {
					<ids-list-view-item>
						<ids-text font-weight="semi-bold">{{ task.name }}</ids-text>
						<ids-text>{{ task.description }}</ids-text>
						<ids-text font-size="14">{{ task.dueDate }}</ids-text>
					</ids-list-view-item>
				}
			</ids-list-view>
		}
	`,
	providers: [ListService],
	imports: [ScrollDirective],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmptyStateComponent implements OnInit {
	private listService = inject(ListService);
	private widgetContext = inject(IWidgetContext);
	private widgetInstance = inject(IWidgetInstance);

	tasks: Task[] = [];

	ngOnInit() {
		this.loadTasks();

		this.widgetInstance.refreshed = () => {
			this.loadTasks();
		};
	}
	loadTasks() {
		this.setBusy(true);
		this.listService.getTasks().subscribe((tasks) => {
			if (!tasks.length) {
				this.widgetContext.setEmptyState({
					icon: EmptyStateIcon.NoData,
					title: "No Data Found",
				});
			} else {
				this.widgetContext.clearEmptyState();
			}
			this.tasks = tasks;
			this.setBusy(false);
		});
	}

	loadMoreTasks() {
		this.listService.getMoreTasks().subscribe((tasks) => {
			this.tasks = this.tasks.concat(tasks);
			this.setBusy(false);
		});
	}

	loadMore() {
		if (this.tasks.length) {
			this.setBusy(true, "bottom");
			this.loadMoreTasks();
		}
	}

	private setBusy(isBusy: boolean, pos?: BusyStatePosition) {
		const stateOptions: BusyStateOptions = {};

		if (pos) {
			stateOptions.position = pos;
		}

		this.widgetContext.setState(
			isBusy ? WidgetState.busy : WidgetState.running,
			stateOptions,
		);
	}
}

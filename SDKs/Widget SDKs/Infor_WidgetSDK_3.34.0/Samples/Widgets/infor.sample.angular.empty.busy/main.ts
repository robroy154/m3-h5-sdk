import { CommonModule } from "@angular/common";
import { Component, Input, NgModule, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SohoComponentsModule } from "@infor/sohoxi-angular";
import {
	BusyStateOptions,
	BusyStatePosition,
	EmptyStateIcon,
	IWidgetComponent,
	IWidgetContext,
	IWidgetInstance,
	WidgetState,
} from "lime";
import { ListService } from "./list.service";
import { ScrollDirective } from "./scroll.directive";
import { Task } from "./task";
@Component({
	template: `
		<div
			observeScroll
			(scrollBottom)="loadMore()"
			*ngIf="tasks.length"
			style="height: 100%; overflow: auto;">
			<soho-listview>
				<li soho-listview-item *ngFor="let task of tasks">
					<p soho-listview-header>{{ task.name }}</p>
					<p soho-listview-subheader>{{ task.description }}</p>
					<p soho-listview-micro>{{ task.dueDate }}</p>
				</li>
			</soho-listview>
		</div>
	`,
	providers: [ListService],
})
export class EmptyStateComponent implements IWidgetComponent, OnInit {
	@Input() widgetContext: IWidgetContext;
	@Input() widgetInstance: IWidgetInstance;

	tasks: Task[] = [];

	constructor(private listService: ListService) {}
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
@NgModule({
	imports: [CommonModule, FormsModule, SohoComponentsModule],
	declarations: [EmptyStateComponent, ScrollDirective],
})
export class EmptyStateModule {}

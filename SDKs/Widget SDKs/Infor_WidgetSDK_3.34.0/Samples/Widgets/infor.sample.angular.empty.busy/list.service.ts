import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay, tap } from "rxjs/operators";
import { Task } from "./task";

@Injectable()
export class ListService {
	tasks: Task[] = [
		new Task(
			"Task #Task 191/2001",
			"Special fields test - New item has been created.",
			"Due: 2021/10/22",
		),
		new Task(
			"Task #Task #063002",
			"Part #4212132 has low inventory level.",
			"Due: 2021/11/22",
		),
		new Task(
			"Task #Task #063003",
			"Check #112412 parts ordering.",
			"Due: 2021/09/15",
		),
		new Task(
			"Task #Task #063004",
			"Special fields test - New item has been created.",
			"Due: 2021/10/07",
		),
		new Task("Task #Task #063005", "Call XYZ Inc at 5 PM.", "Due: 2021/10/11"),
		new Task(
			"Task #Task 191/2002",
			"Part #4212132 has low inventory level.",
			"Due: 2021/11/10",
		),
	];

	private returnEmpty = Math.random() > 0.5;

	getTasks(): Observable<Task[]> {
		return of(this.returnEmpty ? [] : this.tasks).pipe(
			delay(4000),
			tap(() => (this.returnEmpty = !this.returnEmpty)),
		);
	}

	getMoreTasks(): Observable<Task[]> {
		return of(this.tasks).pipe(delay(2000));
	}
}

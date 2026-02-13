export class Task {
	readonly name: string;
	readonly description: string;
	readonly dueDate: string;

	constructor(name: string, description: string, dueDate: string) {
		this.name = name;
		this.description = description;
		this.dueDate = dueDate;
	}
}

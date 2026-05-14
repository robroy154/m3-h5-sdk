import { Directive, OnDestroy } from "@angular/core";
import { Log } from "@infor-lime/core";

@Directive()
export abstract class Counter implements OnDestroy {
	private internalCounter = 0;
	private logPrefix: string;

	constructor() {
		this.logPrefix = this.constructor.name;
		this.log("created");
	}

	get count() {
		return this.internalCounter;
	}

	ngOnDestroy() {
		this.log("destroyed");
	}

	increment() {
		this.log("increment");
		this.internalCounter++;
	}

	decrement() {
		this.log("decrement");
		this.internalCounter--;
	}

	protected log(message: string) {
		Log.debug(`[infor.sample.angular.service] (${this.logPrefix}) ${message}`);
	}
}

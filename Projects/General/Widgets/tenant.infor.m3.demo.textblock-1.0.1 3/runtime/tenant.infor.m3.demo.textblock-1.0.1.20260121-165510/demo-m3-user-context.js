System.register(['tslib', '@angular/core', '@infor-lime/core', 'rxjs'], (function (exports) {
	'use strict';
	var __decorate, Injectable, Log, shareReplay, map, catchError, mergeAll, first, throwError;
	return {
		setters: [function (module) {
			__decorate = module.__decorate;
		}, function (module) {
			Injectable = module.Injectable;
		}, function (module) {
			Log = module.Log;
		}, function (module) {
			shareReplay = module.shareReplay;
			map = module.map;
			catchError = module.catchError;
			mergeAll = module.mergeAll;
			first = module.first;
			throwError = module.throwError;
		}],
		execute: (function () {

			let DemoM3UserContextService = exports("DemoM3UserContextService", class DemoM3UserContextService {
			    constructor() {
			        this.numRequests = 0;
			        this.users = {};
			    }
			    getUserContext(widgetContext, USID = "") {
			        this.numRequests++;
			        this.users[USID] ??= this.getUserData(widgetContext, USID).pipe(shareReplay(1));
			        return this.users[USID];
			    }
			    getUserData(context, USID = "") {
			        return context
			            .executeIonApiAsync({
			            url: "/M3/m3api-rest/v2/execute/MNS150MI/GetUserData",
			            method: "GET",
			            params: { USID },
			        })
			            .pipe(map((response) => this.handleResponse(response)), catchError((err) => this.handleError(context, err)), mergeAll(), first());
			    }
			    handleError(context, err) {
			        const logPrefix = `[DemoM3UserContextService][${context.getId()}] `;
			        Log.error(logPrefix + JSON.stringify(err, null, "\t"));
			        return throwError(() => new Error(err.message));
			    }
			    handleResponse(response) {
			        const result = response.data.results[0];
			        if (result.errorMessage) {
			            throw new Error(result.errorMessage);
			        }
			        return result.records;
			    }
			});
			exports("DemoM3UserContextService", DemoM3UserContextService = __decorate([
			    Injectable({
			        providedIn: "root",
			    })
			], DemoM3UserContextService));

		})
	};
}));

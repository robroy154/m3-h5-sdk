import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { MiUtilService } from "./mi-util.service";

export interface User {
	CONO: string;
	DIVI: string;
	LANC: string;
	DTFM: string;
	DCFM: string;
	TIZO: string;
	FACI: string;
	WHLO: string;
	CUNO: string;
	DEPT: string;
	TX40: string;
	CONM: string;
	MNVR: string;
	DFMN: string;
	USID: string;
	NAME: string;
	EQAL: string;
	USTA: string;
	EMAL: string;
	USTP: string;
	EUID: string;
	PHNO: string;
	TFNO: string;
	FRF6: string;
	FRF7: string;
	FRF8: string;
	FADT: string;
	LADT: string;
	ULTP: string;
	CSYS: string;
	CHNO: string;
	CHN2: string;
	DEVD: string;
	PROE: string;
}

@Injectable(/* {
  providedIn: "root",
} */)
export class UserService {
	private readonly miUtil = inject(MiUtilService);

	user!: User;
	userMap = new Map<string, string>();

	init(): Observable<void> {
		return this.miUtil.execute("MNS150MI", "GetUserData", {}, 1).pipe(
			tap((result: User) => {
				Object.keys(result).forEach((key) => {
					this.userMap.set("USER-" + key, result[key as keyof User]);
				});
				this.user = result;
			}),
			map(() => void 0),
		);
	}
}

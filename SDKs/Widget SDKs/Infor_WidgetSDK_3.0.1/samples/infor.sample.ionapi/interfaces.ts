export interface IUserEmails {
	value?: string;
}

export interface IUser {
	name: {
		givenName?: string;
		familyName?: string;
	};
	id?: string;
	emails?: IUserEmails[];
	profilePicture?: {
		cdnPath: string;
		cdnPathLargeImage: string;
		cdnPathMediumImage: string;
		cdnPathSmallImage: string;
	};
}

export interface IUserDetailResponse {
	response: {
		userlist: IUser[];
		responsestatus: string;
		errorlist: unknown[];
	};
}

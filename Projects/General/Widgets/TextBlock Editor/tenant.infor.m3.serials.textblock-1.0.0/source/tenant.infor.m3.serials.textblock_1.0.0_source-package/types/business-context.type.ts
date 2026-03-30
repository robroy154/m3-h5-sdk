export interface IBusinessContext {
	entities: IEntity[];
	session: ISession;
	program: string;
	panel?: string;
}

export interface IEntity {
	entityType: string;
	accountingEntity: string;
	visible: boolean;
	id1: string;
	id2?: string;
	id3?: string;
	id4?: string;
	id5?: string;
	id6?: string;
	id7?: string;
	id8?: string;
	id9?: string;
	drillbackURL?: "";
}

export interface ISession {
	cono: string;
	divi: string;
	lng: string;
	moddate: string;
	user: string;
	userid: string;
	df: string;
}

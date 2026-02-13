export interface IListItemMap {
	[key: string]: ListItem;
}

export class ListItem {
	title?: string;
	description?: string;
	translations?: IListItemMap;
}

export interface IEditItemParameter {
	item: ListItem;
}

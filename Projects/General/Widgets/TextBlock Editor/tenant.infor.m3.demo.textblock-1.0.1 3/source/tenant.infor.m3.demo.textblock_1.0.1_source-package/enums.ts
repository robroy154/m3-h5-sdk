export enum Mode {
	Display = 0,
	Edit = 1,
	New = 2,
}

export enum State {
	ErrorLoading,
	NoData,
	WaitingForContext,
	Ok,
	Editing,
	New,
}

export enum WidgetMessageType {
	Info = 0,
	Alert = 1,
	Error = 2,
}

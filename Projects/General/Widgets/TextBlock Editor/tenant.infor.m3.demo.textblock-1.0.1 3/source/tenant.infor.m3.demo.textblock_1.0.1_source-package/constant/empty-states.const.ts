import { EmptyStateIcon } from "@infor-lime/core";
import { State } from "../enums";

export const EMPTY_STATE = {
	[State.ErrorLoading]: {
		icon: EmptyStateIcon.ErrorLoading + "-new",
		info: "empty-error-loading-info",
		title: "empty-error-loading-title",
	},
	[State.NoData]: {
		icon: EmptyStateIcon.NoData + "-new",
		info: "",
		title: "empty-no-data-title",
	},
	[State.WaitingForContext]: {
		icon: EmptyStateIcon.Generic + "-new",
		info: "",
		title: "empty-generic-title",
	},
};

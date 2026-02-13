import { IWidgetInstance } from "@infor-lime/core";
import { W2WReceiverComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: W2WReceiverComponent,
		},
	};
};

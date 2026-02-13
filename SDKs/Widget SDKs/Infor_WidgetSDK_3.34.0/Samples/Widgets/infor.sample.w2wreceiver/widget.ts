import { IWidgetInstance } from "lime";
import { W2WReceiverComponent, W2WReceiverModule } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: W2WReceiverModule,
			componentType: W2WReceiverComponent,
		},
	};
};

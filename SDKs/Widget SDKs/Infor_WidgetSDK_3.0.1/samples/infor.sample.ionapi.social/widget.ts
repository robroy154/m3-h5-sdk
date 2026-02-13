import { IWidgetInstance } from "@infor-lime/core";
import { IonApiSocialComponent } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			componentType: IonApiSocialComponent,
		},
	};
};

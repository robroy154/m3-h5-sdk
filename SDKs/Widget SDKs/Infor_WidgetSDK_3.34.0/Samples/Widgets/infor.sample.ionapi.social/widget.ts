import { IWidgetInstance } from "lime";
import { IonApiSocialComponent, IonApiSocialModule } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: IonApiSocialModule,
			componentType: IonApiSocialComponent,
		},
	};
};

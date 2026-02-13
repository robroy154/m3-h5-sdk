import { IWidgetInstance } from "lime";
import { CardListComponent, CardListModule } from "./main";

export const widgetFactory = (): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: CardListModule,
			componentType: CardListComponent,
		},
	};
};

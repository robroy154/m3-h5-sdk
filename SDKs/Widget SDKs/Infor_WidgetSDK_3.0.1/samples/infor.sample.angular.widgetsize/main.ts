import { AsyncPipe } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	inject,
} from "@angular/core";

import { IWidgetContext } from "@infor-lime/core";

@Component({
	template: `
		@if (size$ | async; as size) {
			<ids-layout-flex
				[attr.direction]="size.cols < 3 ? 'column' : 'row'"
				justify-content="center"
				align-items="center"
				height="100%">
				<ids-text
					type="h1"
					font-size="40"
					[color]="getColor(size.cols)"
					text-align="center">
					{{ size.cols }} x {{ size.rows }}
				</ids-text>
				<ids-text type="p" class="padding-x-30" text-align="center">
					{{ infoMsg }}
				</ids-text>
			</ids-layout-flex>
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [AsyncPipe],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WidgetSizeComponent {
	private context = inject(IWidgetContext);

	getColor(cols: number): string {
		return cols === 1
			? "red-50"
			: cols === 2
				? "blue-50"
				: cols === 3
					? "yellow-50"
					: cols === 4
						? "green-50"
						: "";
	}

	size$ = this.context.getSize();
	infoMsg = this.context.getLanguage().get("infoMsg");
}

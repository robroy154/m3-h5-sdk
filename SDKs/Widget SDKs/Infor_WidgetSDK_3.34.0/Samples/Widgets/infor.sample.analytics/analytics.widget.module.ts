import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SohoComponentsModule } from "@infor/sohoxi-angular";
import { AnalyticsWidgetComponent } from "./analytics-widget.component";
import { TrackClickDirective } from "./track-click.directive";
import { UniqueIdPipe } from "./unique-id.pipe";

@NgModule({
	imports: [CommonModule, SohoComponentsModule],
	declarations: [AnalyticsWidgetComponent, TrackClickDirective, UniqueIdPipe],
})
export class AnalyticsWidgetModule {}

import { AsyncPipe, JsonPipe } from "@angular/common";
import {
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	inject,
	NgZone,
	OnInit,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
	IDevice,
	IGetNetworkResult,
	IGetSensorsResult,
	IMapCoordinates,
	IMediaSource,
	IWidgetContext,
	WidgetMessageType,
} from "@infor-lime/core";
import { forkJoin, Observable, of, Subject } from "rxjs";
import { map, scan, switchMap } from "rxjs/operators";
import { DOCS_TEST_BASE64, PDF_TEST_BASE64 } from "./base64Data";
import { IdsRadioGroupValueAccessorDirective } from "./ids-value-accessor.directive";
import { Base64AudioPipe, Base64ImagePipe, Base64VideoPipe } from "./pipes";

export interface ILogEntry {
	message: string;
	isError?: boolean;
}

@Component({
	template: `
		<ids-accordion>
			<ids-accordion-panel>
				<ids-accordion-header slot="header">
					<ids-icon icon="map-pin" size="medium"></ids-icon>
					<ids-text font-size="16">Location</ids-text>
				</ids-accordion-header>
				<ids-button slot="content" appearance="primary" (click)="getLocation()">
					Get location
				</ids-button>
				@if (location$ | async; as location) {
					<p slot="content">
						latitude: <b>{{ location.latitude }}</b
						>, longitude: <b>{{ location.longitude }}</b>
					</p>
				}
			</ids-accordion-panel>

			<ids-accordion-panel>
				<ids-accordion-header slot="header">
					<ids-icon icon="barcode" size="medium"></ids-icon>
					<ids-text font-size="16">Barcode Scanner</ids-text>
				</ids-accordion-header>
				<ids-button slot="content" appearance="primary" (click)="readBarcode()">
					Scan Barcode
				</ids-button>
				@if (barcode$ | async; as barcode) {
					<p slot="content">{{ barcode }}</p>
				}
			</ids-accordion-panel>

			<ids-accordion-panel>
				<ids-accordion-header slot="header">
					<ids-icon icon="connections" size="medium"></ids-icon>
					<ids-text font-size="16">Network</ids-text>
				</ids-accordion-header>
				<ids-button slot="content" appearance="primary" (click)="getNetwork()">
					Get network
				</ids-button>
				@if (network$ | async; as network) {
					<p slot="content">
						connectionState: <b>{{ network.connectionState }}</b
						>, connectionType: <b>{{ network.connectionType }}</b>
					</p>
				}
			</ids-accordion-panel>

			<ids-accordion-panel>
				<ids-accordion-header slot="header">
					<ids-icon icon="link" size="medium"></ids-icon>
					<ids-text font-size="16">Links</ids-text>
				</ids-accordion-header>
				<ids-input slot="content" #url value="https://example.com" />
				<ids-button
					slot="content"
					appearance="primary"
					(click)="launchMobileLink(url.value)">
					Mobile Launch
				</ids-button>
				<ids-button
					slot="content"
					appearance="secondary"
					(click)="launchLink(url.value)">
					Context Launch
				</ids-button>
			</ids-accordion-panel>

			<ids-accordion-panel>
				<ids-accordion-header slot="header">
					<ids-icon icon="technology" size="medium"></ids-icon>
					<ids-text font-size="16">Motion sensors</ids-text>
				</ids-accordion-header>
				<ids-button slot="content" appearance="primary" (click)="getSensors()">
					Get sensors
				</ids-button>
				@if (sensors$ | async; as sensors) {
					<p slot="content">
						acceleration: <b>{{ sensors.acceleration | json }}</b
						>, gyroscope: <b>{{ sensors.gyroscope | json }}</b>
					</p>
				}
			</ids-accordion-panel>

			<ids-accordion-panel>
				<ids-accordion-header slot="header">
					<ids-icon icon="map" size="medium"></ids-icon>
					<ids-text font-size="16">Maps</ids-text>
				</ids-accordion-header>
				<p slot="content">
					<ids-button
						slot="content"
						appearance="tertiary"
						(click)="showMapLocation()">
						Map with a location
					</ids-button>
				</p>
				<p slot="content">
					<ids-button
						slot="content"
						appearance="tertiary"
						(click)="showMapLocation(true)">
						Map with current position
					</ids-button>
				</p>
				<p slot="content">
					<ids-button
						slot="content"
						appearance="tertiary"
						(click)="showMapMarkers()">
						Map with markers
					</ids-button>
				</p>
				<p slot="content">
					<ids-button
						slot="content"
						appearance="tertiary"
						(click)="showMapNavigation()">
						<span> Navigation map</span>
					</ids-button>
				</p>
				<p slot="content">
					<ids-button
						slot="content"
						appearance="tertiary"
						(click)="showMapNavigation(true)">
						Navigation map from current position
					</ids-button>
				</p>
			</ids-accordion-panel>

			<ids-accordion-panel>
				<ids-accordion-header slot="header">
					<ids-icon icon="camera" size="medium"></ids-icon>
					<ids-text font-size="16">Image</ids-text>
				</ids-accordion-header>
				<ids-radio-group slot="content" [(ngModel)]="imageSource">
					<ids-radio
						label="Both"
						id="{{ wid + 'i-source-all' }}"
						name="{{ wid + 'i-source-all' }}"
						value="all">
					</ids-radio>
					<ids-radio
						label="Camera"
						id="{{ wid + 'i-source-camera' }}"
						name="{{ wid + 'i-source-camera' }}"
						value="camera">
					</ids-radio>
					<ids-radio
						label="Library"
						id="{{ wid + 'i-source-library' }}"
						name="{{ wid + 'i-source-library' }}"
						value="library">
					</ids-radio>
				</ids-radio-group>
				<ids-button
					slot="content"
					appearance="primary"
					(click)="getImage(imageSource)">
					Get Image
				</ids-button>
				@if (image$ | async; as imageData) {
					<p slot="content">
						<img [src]="imageData | base64Image" />
					</p>
				}
			</ids-accordion-panel>

			<ids-accordion-panel>
				<ids-accordion-header slot="header">
					<ids-icon icon="record" size="medium"></ids-icon>
					<ids-text font-size="16">Video</ids-text>
				</ids-accordion-header>
				<ids-radio-group slot="content" [(ngModel)]="videoSource">
					<ids-radio
						label="Both"
						id="{{ wid + 'v-source-all' }}"
						name="{{ wid + 'v-source-all' }}"
						value="all">
					</ids-radio>
					<ids-radio
						label="Camera"
						id="{{ wid + 'v-source-camera' }}"
						name="{{ wid + 'v-source-camera' }}"
						value="camera">
					</ids-radio>
					<ids-radio
						label="Library"
						id="{{ wid + 'v-source-library' }}"
						name="{{ wid + 'v-source-library' }}"
						value="library">
					</ids-radio>
				</ids-radio-group>
				<ids-button
					slot="content"
					appearance="primary"
					(click)="getVideo(videoSource)">
					Get Video
				</ids-button>
				@if (video$ | async; as videoData) {
					<p slot="content">
						<video [src]="videoData | base64Image" controls></video>
					</p>
				}
			</ids-accordion-panel>

			<ids-accordion-panel>
				<ids-accordion-header slot="header">
					<ids-icon icon="tree-audio" size="medium"></ids-icon>
					<ids-text font-size="16">Audio</ids-text>
				</ids-accordion-header>
				<ids-button slot="content" appearance="primary" (click)="getAudio()">
					Get Audio
				</ids-button>
				@if (audio$ | async; as audioData) {
					<audio slot="content" controls>
						<source [src]="audioData | base64Audio" type="audio/wav" />
						<source [src]="audioData | base64Audio: 'mp3'" type="audio/mp3" />
					</audio>
				}
			</ids-accordion-panel>

			<ids-accordion-panel>
				<ids-accordion-header slot="header">
					<ids-icon icon="attach" size="medium"></ids-icon>
					<ids-text font-size="16">Documents</ids-text>
				</ids-accordion-header>
				<p slot="content">
					<ids-button
						slot="content"
						appearance="tertiary"
						(click)="openDocumentPDF()">
						Open a PDF
					</ids-button>
				</p>
				<p slot="content">
					<ids-button
						slot="content"
						appearance="tertiary"
						(click)="openDocumentWord()">
						Open a Word Document
					</ids-button>
				</p>
			</ids-accordion-panel>

			<ids-accordion-panel>
				<ids-accordion-header slot="header">
					<ids-icon icon="tree-code" size="medium"></ids-icon>
					<ids-text font-size="16">Logs</ids-text>
				</ids-accordion-header>
				<ids-button
					slot="content"
					appearance="tertiary"
					(click)="initLogging()">
					Clear
				</ids-button>
				@for (logEntry of logs$ | async; track logEntry) {
					<p slot="content" [class.error-text]="logEntry.isError">
						{{ logEntry.message }}
					</p>
				}
			</ids-accordion-panel>
		</ids-accordion>
	`,
	styles: [
		`
			.log-container > p {
				font-size: 12px;
				line-height: 12px;
				margin: 0;
				padding: 1px;
				border: 1px solid lightgray;
			}

			video {
				max-width: 100%;
				border: 1px solid gray;
			}
		`,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [
		ReactiveFormsModule,
		FormsModule,
		AsyncPipe,
		JsonPipe,
		Base64ImagePipe,
		Base64AudioPipe,
		Base64VideoPipe,
		IdsRadioGroupValueAccessorDirective,
	],
})
export class MobileWidgetComponent implements OnInit {
	private widgetContext = inject(IWidgetContext);
	private zone = inject(NgZone);

	wid = this.widgetContext.getWidgetInstanceId();

	imageSource: IMediaSource = "all";
	videoSource: IMediaSource = "all";

	sensors$ = new Subject<IGetSensorsResult>();
	barcode$ = new Subject<string>();
	audio$ = new Subject<string>();
	video$ = new Subject<string>();
	image$ = new Subject<string>();
	network$ = new Subject<IGetNetworkResult>();
	location$ = new Subject<IMapCoordinates>();
	logs$: Observable<ILogEntry[]>;

	private device$: Observable<IDevice>;

	constructor() {
		this.initLogging();
	}

	ngOnInit() {
		this.device$ = this.widgetContext.getDevice();
	}

	launchLink(url: string) {
		this.widgetContext.launch({ url });
	}

	launchMobileLink(url: string) {
		this.device$
			.pipe(switchMap((device) => device.openExternalLink({ url })))
			.subscribe();
	}

	getImage(source: IMediaSource) {
		this.device$
			.pipe(
				switchMap((device) => device.getImage({ source })),
				map((result) => result.data),
			)
			.subscribe(
				(imageData) => this.image$.next(imageData),
				this.errorHandler("Failed to get image"),
			);
	}

	getVideo(source: IMediaSource) {
		this.device$
			.pipe(
				switchMap((device) => device.getVideo({ source })),
				map((result) => result.data),
			)
			.subscribe(
				(videoData) => this.video$.next(videoData),
				this.errorHandler("Failed to get video"),
			);
	}

	getAudio() {
		this.device$
			.pipe(
				switchMap((device) => device.getAudio()),
				map((result) => result.data),
			)
			.subscribe(
				(audioData) => this.audio$.next(audioData),
				this.errorHandler("Failed to get audio"),
			);
	}

	showMapLocation(useCurrentLocation?: boolean) {
		const currentLocation$ = this.device$.pipe(
			switchMap((device) => device.getLocation()),
		);
		const coordinates$ = useCurrentLocation
			? currentLocation$
			: of({ latitude: 40.74077, longitude: -73.994754 });
		forkJoin(this.device$, coordinates$)
			.pipe(
				switchMap(([device, coordinates]) =>
					device.showMap({
						mapType: "location",
						coordinates,
					}),
				),
			)
			.subscribe();
	}

	showMapMarkers() {
		this.device$
			.pipe(
				switchMap((device) =>
					device.showMap({
						mapType: "marker",
						markers: [
							{
								coordinates: { latitude: 40.74077, longitude: -73.994754 },
								label: "Infor Headquarters",
							},
							{
								coordinates: { latitude: 40.758891, longitude: -73.985128 },
								label: "Times Square",
							},
							{
								coordinates: { latitude: 40.748402, longitude: -73.985593 },
								label: "Empire State Building",
							},
						],
					}),
				),
			)
			.subscribe();
	}

	showMapNavigation(fromCurrentLocation?: boolean) {
		const currentLocation$ = this.device$.pipe(
			switchMap((device) => device.getLocation()),
		);
		const startLocation = fromCurrentLocation
			? currentLocation$
			: of({ latitude: 40.722926, longitude: -74.002157 });
		forkJoin(this.device$, startLocation)
			.pipe(
				switchMap(([device, start]) =>
					device.showMap({
						mapType: "navigation",
						start,
						destination: { latitude: 40.74077, longitude: -73.994754 },
					}),
				),
			)
			.subscribe();
	}

	getLocation() {
		this.device$
			.pipe(switchMap((device) => device.getLocation()))
			.subscribe(
				(location) => this.location$.next(location),
				this.errorHandler("Failed to get location"),
			);
	}

	readBarcode() {
		this.device$
			.pipe(
				switchMap((device) => device.readBarcode()),
				map((result) => result.text),
			)
			.subscribe(
				(value) => this.barcode$.next(value),
				this.errorHandler("Failed to read barcode"),
			);
	}

	getNetwork() {
		this.device$
			.pipe(switchMap((device) => device.getNetwork()))
			.subscribe(
				(data) => this.network$.next(data),
				this.errorHandler("Failed to get network"),
			);
	}

	getSensors() {
		this.device$
			.pipe(switchMap((device) => device.getSensors()))
			.subscribe(
				(sensorData) => this.sensors$.next(sensorData),
				this.errorHandler("Failed to get sensors"),
			);
	}

	openDocumentPDF() {
		this.device$
			.pipe(
				switchMap((device) =>
					device.openDocument({
						data: PDF_TEST_BASE64,
						name: "test.pdf",
						type: "application/pdf",
					}),
				),
			)
			.subscribe();
	}

	openDocumentWord() {
		this.device$
			.pipe(
				switchMap((device) =>
					device.openDocument({
						data: DOCS_TEST_BASE64,
						name: "test.docx",
						type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
					}),
				),
			)
			.subscribe();
	}

	/**
	 * NOTE: This method will override console.log and console.error.
	 * This should never ever ever ever be done in a production environment,
	 * and it is quite dangerous to do even in development.
	 */
	initLogging() {
		const consoleLogs$: Observable<ILogEntry> = new Observable<ILogEntry>(
			(observer) => {
				const oldConsoleLog = window.console.log;
				const oldConsoleError = window.console.error;
				window.console.log = (...args: unknown[]) => {
					const message = args.map((s) => JSON.stringify(s)).join(" ");
					this.zone.run(() => observer.next({ message }));
					oldConsoleLog(...args);
				};
				window.console.error = (...args: unknown[]) => {
					const message = args.map((s) => JSON.stringify(s)).join(" ");
					this.zone.run(() => observer.next({ message, isError: true }));
					oldConsoleError(...args);
				};
			},
		);
		this.logs$ = consoleLogs$.pipe(
			scan<ILogEntry, ILogEntry[]>((entries, entry) => [entry, ...entries], []),
		);
	}

	private errorHandler = (message: string) => (error?: Error) =>
		this.showError(message, error);

	private showError(message: string, error?: Error) {
		const details =
			error && error.message ? error.message : `${JSON.stringify(error)}`;
		this.widgetContext.showWidgetMessage({
			message: `${message}: ${details}`,
			type: WidgetMessageType.Error,
		});
	}
}

 /**
 * H5 Script SDK sample.
 */

/**
 * Executes requests to Ming.le and M3 ION APIs.
 * For MUA 10.4 only.
 * 
 * No setup needed if script will be uploaded thru Admin Tools
 * During development, to run this script in any instance where an authorization server is not available,
 * you will need to set the OAuth token manually:
 *  - Acquire an OAuth token string.
 *      + Log on to Ming.le.
 *      + Open a new tab in the same browser and navigate to the Grid SAML Session Provider OAuth resource.
 *      + The Grid must be version 2.0 or later with a SAML Session Provider configured for the same IFS as Ming.le.
            Example: https://yourservernameandport/grid/rest/security/sessions/oauth
 *  - Copy the token to the script arguments.
 *  - When the token times out, you must acquire a new token and update the script arguments.
 */
class H5SampleIonApiService {
    private controller: IInstanceController;
    private log: IScriptLog;
    private args: any;

    private readonly mingleEndpoint = "Mingle";
    private readonly m3Endpoint = "M3/m3api-rest/execute";
    private readonly m3EndpointV2 = "M3/m3api-rest/v2/execute";

    private ionApiService;
    private miService;
    private version;

    constructor(args: IScriptArgs) {
        this.controller = args.controller;
        this.log = args.log;
        this.args = args.args;
        this.version = ScriptUtil.version;

        if (this.version >= 2.0) {
            this.ionApiService = IonApiService;
            this.miService = MIService;
        } else {
            this.ionApiService = IonApiService.Current;
            this.miService = MIService.Current;
        }
    }

    /**
    * Script initialization function.
    */
    public static Init(args: IScriptArgs): void {
        new H5SampleIonApiService(args).run();
    }

    private run(): void {
        this.addMingleButton();
        this.addM3Button();
        this.addM3ButtonV2();

        /* For development purposes only
        Make sure to add a valid access token as the script argument.
        See comments above or the development guide for details.
        */
        // this.ionApiService.setToken(this.args);
    }

    private addMingleButton(): void {
        const run = new ButtonElement();
        run.Name = "runguid";
        run.Value = "Get user GUID";
        run.Position = new PositionElement();
        run.Position.Top = 4;
        run.Position.Left = 8;
        run.Position.Width = 5;

        if (this.version >= 2.0) {
            run.Position.Left = 7;
        }

        const contentElement = this.controller.GetContentElement();
        const $run = contentElement.AddElement(run);
        $run.click(() => {
            const request: IonApiRequest = {
                url: `${this.ionApiService.getBaseUrl()}/${this.mingleEndpoint}/SocialService.Svc/User/Detail`,
                method: "GET"
            }

            this.ionApiService.execute(request).then((response: IonApiResponse) => {
                const data = response.data

                if(!data.ErrorList) {
                    this.controller.ShowMessage(data["UserDetailList"][0].UserGUID);
                }
                else {
                    for(const error of data.ErrorList) {
                        this.log.Error(error.Message);
                    }
                }
            }).catch((response: IonApiResponse) => {
                this.log.Error(response.message);
            });
        });
    }

    private addM3Button() {
        const run = new ButtonElement();
        run.Name = "runemail";
        run.Value = "Get M3 user email";
        run.Position = new PositionElement();
        run.Position.Top = 4;
        run.Position.Left = 16;
        run.Position.Width = 5;

        const contentElement = this.controller.GetContentElement();
        const $run = contentElement.AddElement(run);
        $run.click(() => {
            const request: IonApiRequest = {
                url: `/${this.m3Endpoint}/MNS150MI/GetUserData/`,
                method: "GET",
                record: {
                    USID: ScriptUtil.GetUserContext("USID")
                }
            }

            this.ionApiService.execute(request).then((response: IonApiResponse) => {
                const responseData = this.miService.parseResponse({},  response.data);

                if(responseData.item) {
                    this.controller.ShowMessage(responseData.item.EMAL);
                }
                if(responseData.errorMessage) {
                    this.controller.ShowMessage(responseData.errorMessage);
                }
            }).catch((response: IonApiResponse) => {
                this.log.Error(response.message);
            });
        });
    }
    
    private addM3ButtonV2() {
        const run = new ButtonElement();
        run.Name = "runV2";
        run.Value = "Get M3 user email Version 2";
        run.Position = new PositionElement();
        run.Position.Top = 4;
        run.Position.Left = 26;
        run.Position.Width = 5;

        if (this.version >= 2.0) {
            run.Position.Left = 27;
        }

        const contentElement = this.controller.GetContentElement();
        const $run = contentElement.AddElement(run);
        $run.click(() => {
            const request: IonApiRequest = {
                url: `/${this.m3EndpointV2}/MNS150MI/GetUserData/`,
                method: "GET",
                record: {
                    USID: ScriptUtil.GetUserContext("USID")
                }
            }
            this.ionApiService.execute(request).then((response: IonApiResponse) => {
                const responseData = this.miService.parseResponseV2({}, response.data);

                if(responseData.items[0]) {
                    this.controller.ShowMessage(responseData.items[0].EMAL);
                }
                if(responseData.errorMessage) {
                    this.controller.ShowMessage(responseData.errorMessage);
                }
            }).catch((response: IonApiResponse) => {
                this.log.Error(response.message);
                this.log.Error(response.statusText);
            });
        });
    }
}

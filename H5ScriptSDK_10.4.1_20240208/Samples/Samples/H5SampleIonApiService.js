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
var H5SampleIonApiService = /** @class */ (function () {
    function H5SampleIonApiService(args) {
        this.mingleEndpoint = "Mingle";
        this.m3Endpoint = "M3/m3api-rest/execute";
        this.m3EndpointV2 = "M3/m3api-rest/v2/execute";
        this.controller = args.controller;
        this.log = args.log;
        this.args = args.args;
        this.version = ScriptUtil.version;
        if (this.version >= 2.0) {
            this.ionApiService = IonApiService;
            this.miService = MIService;
        }
        else {
            this.ionApiService = IonApiService.Current;
            this.miService = MIService.Current;
        }
    }
    /**
    * Script initialization function.
    */
    H5SampleIonApiService.Init = function (args) {
        new H5SampleIonApiService(args).run();
    };
    H5SampleIonApiService.prototype.run = function () {
        this.addMingleButton();
        this.addM3Button();
        this.addM3ButtonV2();
        /* For development purposes only
        Make sure to add a valid access token as the script argument.
        See comments above or the development guide for details.
        */
        // this.ionApiService.setToken(this.args);
    };
    H5SampleIonApiService.prototype.addMingleButton = function () {
        var _this = this;
        var run = new ButtonElement();
        run.Name = "runguid";
        run.Value = "Get user GUID";
        run.Position = new PositionElement();
        run.Position.Top = 4;
        run.Position.Left = 8;
        run.Position.Width = 5;
        if (this.version >= 2.0) {
            run.Position.Left = 7;
        }
        var contentElement = this.controller.GetContentElement();
        var $run = contentElement.AddElement(run);
        $run.click(function () {
            var request = {
                url: "".concat(_this.ionApiService.getBaseUrl(), "/").concat(_this.mingleEndpoint, "/SocialService.Svc/User/Detail"),
                method: "GET"
            };
            _this.ionApiService.execute(request).then(function (response) {
                var data = response.data;
                if (!data.ErrorList) {
                    _this.controller.ShowMessage(data["UserDetailList"][0].UserGUID);
                }
                else {
                    for (var _i = 0, _a = data.ErrorList; _i < _a.length; _i++) {
                        var error = _a[_i];
                        _this.log.Error(error.Message);
                    }
                }
            }).catch(function (response) {
                _this.log.Error(response.message);
            });
        });
    };
    H5SampleIonApiService.prototype.addM3Button = function () {
        var _this = this;
        var run = new ButtonElement();
        run.Name = "runemail";
        run.Value = "Get M3 user email";
        run.Position = new PositionElement();
        run.Position.Top = 4;
        run.Position.Left = 16;
        run.Position.Width = 5;
        var contentElement = this.controller.GetContentElement();
        var $run = contentElement.AddElement(run);
        $run.click(function () {
            var request = {
                url: "/".concat(_this.m3Endpoint, "/MNS150MI/GetUserData/"),
                method: "GET",
                record: {
                    USID: ScriptUtil.GetUserContext("USID")
                }
            };
            _this.ionApiService.execute(request).then(function (response) {
                var responseData = _this.miService.parseResponse({}, response.data);
                if (responseData.item) {
                    _this.controller.ShowMessage(responseData.item.EMAL);
                }
                if (responseData.errorMessage) {
                    _this.controller.ShowMessage(responseData.errorMessage);
                }
            }).catch(function (response) {
                _this.log.Error(response.message);
            });
        });
    };
    H5SampleIonApiService.prototype.addM3ButtonV2 = function () {
        var _this = this;
        var run = new ButtonElement();
        run.Name = "runV2";
        run.Value = "Get M3 user email Version 2";
        run.Position = new PositionElement();
        run.Position.Top = 4;
        run.Position.Left = 26;
        run.Position.Width = 5;
        if (this.version >= 2.0) {
            run.Position.Left = 27;
        }
        var contentElement = this.controller.GetContentElement();
        var $run = contentElement.AddElement(run);
        $run.click(function () {
            var request = {
                url: "/".concat(_this.m3EndpointV2, "/MNS150MI/GetUserData/"),
                method: "GET",
                record: {
                    USID: ScriptUtil.GetUserContext("USID")
                }
            };
            _this.ionApiService.execute(request).then(function (response) {
                var responseData = _this.miService.parseResponseV2({}, response.data);
                if (responseData.items[0]) {
                    _this.controller.ShowMessage(responseData.items[0].EMAL);
                }
                if (responseData.errorMessage) {
                    _this.controller.ShowMessage(responseData.errorMessage);
                }
            }).catch(function (response) {
                _this.log.Error(response.message);
                _this.log.Error(response.statusText);
            });
        });
    };
    return H5SampleIonApiService;
}());
//# sourceMappingURL=H5SampleIonApiService.js.map
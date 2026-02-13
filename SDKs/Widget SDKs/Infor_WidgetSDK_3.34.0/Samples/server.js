const browserSync = require("browser-sync").create();
const fs = require("fs");
const https = require("https");
const path = require("path");

function printUsageAndExit() {
	console.log("Usage:");
	console.log("node server <port> \"<path>\"");
	console.log("Examples:");
	console.log("node server");
	console.log("node server 8080 \"../\"");
	console.log("node server 80 \"C:/Web/MyApplication\"");
	process.exit();
}

function commandLineOptions() {
	const [port, path] = process.argv.slice(2);
	return { port, path };
}

function packageConfigOptions() {
	return {
		port: process.env.npm_package_config_server_port,
		path: process.env.npm_package_config_server_path,
	}
}

function portFromPackageConfig() {
	const { port } = packageConfigOptions();
	if (port) {
		assertValidPort(port);
		return port;
	}
}

function portFromArguments() {
	const { port } = commandLineOptions();
	if (port) {
		assertValidPort(port);
		return port;
	}
}

function assertValidPort(port) {
	if (!port || !Number.isInteger(Number(port))) {
		console.error(`Error: Port '${port}' is invalid.`);
		printUsageAndExit();
	}
}

function pathFromPackageConfig() {
	return packageConfigOptions().path;
}

function pathFromArguments() {
	return commandLineOptions().path;
}

const port = portFromArguments() || portFromPackageConfig() || 8080;
const widgetDirectory = pathFromArguments() || pathFromPackageConfig() || "./Widgets";
const runtimeDirectory = path.join(widgetDirectory, "../runtime");

browserSync.init({
	server: {
		baseDir: [runtimeDirectory, widgetDirectory],
		middleware: [
			{
				route: "/_devWidgets",
				handle: (req, res, next) => {
					console.log("/_devWidgets: listing widgets");
					fs.readdir(widgetDirectory, { withFileTypes: true }, (err, files) => {
						if (err) {
							console.error("/_devWidgets: Error when listing widgets:", err);
							res.writeHead(500, err.message).end();
							return;
						}
						const widgets = files
							.filter(file => file.isDirectory())
							.map(directory => directory.name)
							.filter(directory => directory.match(/[a-z0-9]+\.[a-z0-9]+/i))
							.map(getWidgetInfo)
							.filter(widget => widget !== null);
						console.log(`/_devWidgets: Found ${widgets.length} widgets`);
						res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify(widgets));
					});

					function getWidgetInfo(directory) {
						try {
							const manifest = JSON.parse(fs.readFileSync(path.join("Widgets", directory, "widget.manifest")));
							return {
								path: directory,
								id: manifest.widgetId,
								title: manifest.title || manifest.localization?.["en-US"]?.widgetTitle,
							}
						} catch (error) {
							console.warn(`Failed to get widget info: ${error.message}`);
							return null;
						}
					}
				},
			},
			proxy("/todo-ionapi-proxy-route", "ION_API_HOSTNAME"),
		],
	},
	watch: true,
	port: port,
	open: false,
	ui: false,
	ignore: [
		"**/*.ts",
		"**/*.js.map",
	],
}, (err, instance) => {
	if (err) {
		console.error("Server exited with error:");
		console.error(err);
		process.exit(1);
	}
	if (instance.getOption("port") != port) {
		// Browser-Sync will automatically use another port if the one provided is unavailable.
		// This is a useful feature, but it may cause problems if other scripts and debuggers
		// depend on the explicitly set port.
		console.error(`Error: Port ${port} is not available.`);
		process.exit(1);
	}
	console.log("Press Ctrl+C to stop");
});

/**
 * @param {string} route
 * @param {string} remoteHost
 * @param {number} remotePort
 * @returns {import("browser-sync").PerRouteMiddleware}
 */
function proxy(route, remoteHost, remotePort = 443) {
	return {
		route: route,
		handle: (request, response) => {
			/**
					 * @type {import("https").RequestOptions}
					 */
			const options = {
				hostname: remoteHost,
				port: remotePort,
				path: request.url.replace(route, ""),
				method: request.method,
				headers: request.headers,
				rejectUnauthorized: false
			};

			try {
				const proxyRequest = https.request(options);
				proxyRequest.on("response", function (proxyResponse) {
					try {
						proxyResponse.on("data", function (chunk) {
							response.write(chunk, "binary");
						});
						proxyResponse.on("end", function () {
							response.end();
						});
						proxyResponse.on("error", function (e) {
							console.log("Request error: " + e);
						});
						response.writeHead(proxyResponse.statusCode, proxyResponse.headers);
					} catch (ex) {
						console.log(ex);
					}
				});
				request.on("data", function (chunk) {
					try {
						proxyRequest.write(chunk, "binary");
					} catch (ex) {
						console.log(ex);
					}
				});
				request.on("end", function () {
					try {
						proxyRequest.end();
					} catch (ex) {
						console.log(ex);
					}
				});
			} catch (ex) {
				console.log(ex);
			}
		}
	};
}

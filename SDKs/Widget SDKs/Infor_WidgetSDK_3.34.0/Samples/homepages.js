"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_typescript_1 = __importDefault(require("@rollup/plugin-typescript"));
const archiver_1 = __importDefault(require("archiver"));
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const minimist_1 = __importDefault(require("minimist"));
const ncp_1 = __importDefault(require("ncp"));
const path_1 = __importDefault(require("path"));
const rollup_1 = require("rollup");
const sohoVersion = "10.12.3";
const WidgetIdPattern = "^[a-zA-Z0-9]+([\\.\\-\\_][a-zA-Z0-9]+)*$";
const WidgetIdPatternStrict = "^[a-z0-9]+([\\.][a-z0-9]+)*$";
let _tempDirectory;
let _argv;
let _trace;
let _silent;
let _buildTasksArray;
let _completedTask;
let _isMultiWidgetMode = false;
let _finalSuccessMessage = "";
const tempDirsToRemove = [];
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, "g"), replace);
}
function getTimestamp() {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    let date = new Date(Date.now() - tzoffset).toISOString();
    date = replaceAll(date, "-", "");
    date = replaceAll(date, ":", "");
    date = date.replace("T", "-");
    return date.slice(0, 15);
}
function endsWith(value, suffix) {
    if (!value) {
        return false;
    }
    return value.indexOf(suffix, value.length - suffix.length) !== -1;
}
function round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
function begin(operationName) {
    info("");
    info("Begin: " + operationName + "...");
    return {
        name: operationName,
        start: new Date().getTime(),
    };
}
function end(operation) {
    const duration = new Date().getTime() - operation.start;
    let durationText;
    if (duration < 1000) {
        durationText = "(" + duration + " milliseconds)";
    }
    else {
        durationText = "(" + round(duration / 1000, 1) + " seconds)";
    }
    info("End: " + operation.name + " " + durationText);
}
function createDirectory(dir) {
    if (!fs_extra_1.default.existsSync(dir)) {
        fs_extra_1.default.ensureDirSync(dir);
    }
}
function getManifest(widgetDirectory) {
    const manifestPath = path_1.default.join(widgetDirectory, "widget.manifest");
    if (!fs_1.default.existsSync(manifestPath)) {
        error("Failed to find widget manifest: " + manifestPath);
        exitWithUsage(1);
        return;
    }
    info("Found widget manifest " + manifestPath);
    const originalManifest = fs_1.default.readFileSync(manifestPath, "utf8");
    try {
        return JSON.parse(originalManifest);
    }
    catch (ex) {
        exitError("Invalid Widget manifest. JSON content must be valid, and encoded as UTF-8 (without BOM marker). The encoding can be checked and changed using the Encoding menu in Notepad++.");
    }
}
function getJavaScriptFilename(name) {
    if (!endsWith(name, ".js")) {
        name += ".js";
    }
    return name;
}
function getTypescriptFilename(name) {
    if (!endsWith(name, ".ts")) {
        name += ".ts";
    }
    return name;
}
function getFinalBundleName(task, sharedModule) {
    if (sharedModule) {
        return getJavaScriptFilename(sharedModule.path || sharedModule.name);
    }
    return task.widgetDirectoryName + "." + task.moduleName + ".js";
}
async function bundleWithRollup(task, sharedModule) {
    const operation = begin("Bundle with Rollup");
    const currentDirectory = process.cwd();
    process.chdir(task.tempDirectory);
    info("Changed working directory to: " + process.cwd());
    const inputFile = getTypescriptFilename(sharedModule?.path || sharedModule?.name || task.moduleName);
    const inputPath = task.widgetDirectoryName + "/" + inputFile;
    const outputFile = getFinalBundleName(task, sharedModule);
    const outputPath = task.widgetDirectoryName + "/" + outputFile;
    const typescriptOptions = {
        tsconfig: false,
        compilerOptions: {
            baseUrl: ".",
            sourceMap: false,
            declaration: false,
            noEmitOnError: true,
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            removeComments: true,
            skipLibCheck: true,
            skipDefaultLibCheck: true,
            moduleResolution: "node",
            lib: ["ES2022", "DOM"],
            target: "ES2021",
            useDefineForClassFields: false,
            paths: {
                "@infor/sohoxi-angular": [
                    path_1.default.join(task.absoluteNodeModulesPath, "ids-enterprise-ng"),
                ],
                lime: [
                    path_1.default.join(task.absoluteNodeModulesPath, "lime"),
                    path_1.default.join(task.absoluteNodeModulesPath, "../dist/lime/lime"),
                    path_1.default.join(task.absoluteNodeModulesPath, "../dist/lime"),
                ],
            },
        },
    };
    if (task.sharedModules?.length) {
        const paths = typescriptOptions.compilerOptions.paths;
        for (const sharedModule of task.sharedModules) {
            const modulePath = path_1.default.join(task.widgetDirectoryName, sharedModule.path || sharedModule.name);
            paths[sharedModule.name] = [modulePath];
            trace(`shared module path "${sharedModule.name}" => "${modulePath}"`);
        }
    }
    trace("cwd:", process.cwd());
    trace("typescript compilerOptions:", typescriptOptions.compilerOptions);
    const build = await (0, rollup_1.rollup)({
        input: inputPath,
        external: [
            "rxjs",
            "rxjs/operators",
            "@angular/core",
            "@angular/common",
            "@angular/common/http",
            "@angular/forms",
            "@angular/animations",
            "@angular/platform-browser",
            "ids-enterprise-ng",
            "@infor/sohoxi-angular",
            "lime",
            ...task.sharedModules.map((m) => m.name),
        ],
        plugins: [(0, plugin_typescript_1.default)(typescriptOptions)],
    });
    const output = await build.write({
        file: outputPath,
        format: "system",
        name: sharedModule?.name,
    });
    for (const chunk of output.output) {
        info("Created: " + chunk.fileName);
    }
    await build.close();
    process.chdir(currentDirectory);
    end(operation);
}
function updateManifest(task) {
    const operation = begin("Updating manifest");
    const manifest = task.manifest;
    manifest.moduleName = task.widgetDirectoryName + "." + task.moduleName;
    const sharedModules = manifest.sharedModules;
    if (sharedModules) {
        for (const sharedModule of sharedModules) {
            sharedModule.isBundle = true;
        }
    }
    if (getBooleanArg("addDisplayVersion", false)) {
        info("Setting dislayVersion property: " + task.displayVersion);
        manifest.displayVersion = task.displayVersion;
    }
    if (getBooleanArg("asTenant", false)) {
        if (!manifest.displayVersion) {
            info(`Setting dislayVersion property: ${task.displayVersion}`);
            manifest.displayVersion = task.displayVersion;
        }
        if (!manifest.widgetId.startsWith("tenant")) {
            const tenantWidgetId = `tenant.${manifest.widgetId}`;
            info(`Setting widgetId: ${tenantWidgetId}`);
            manifest.widgetId = tenantWidgetId;
        }
        if (!manifest.author) {
            const author = "Widget Developer";
            info(`Setting author: ${author}`);
            manifest.author = author;
        }
    }
    if (manifest.aotVersion != null) {
        delete manifest.aotVersion;
        delete manifest.sohoVersion;
    }
    if (task.isNativeInline) {
        manifest.isNativeInline = true;
    }
    const filename = path_1.default.join(task.widgetTempDirectory, "widget.manifest");
    info("Manifest filename: " + filename);
    fs_1.default.writeFileSync(filename, JSON.stringify(manifest), { encoding: "utf8" });
    end(operation);
}
function packZip(task) {
    const operation = begin("Pack widget zip");
    const manifest = task.manifest;
    const widgetId = task.widgetDirectoryName;
    const outputName = task.manifest.widgetId + "-" + task.displayVersion;
    const sharedModules = manifest.sharedModules;
    const isMultiModule = task.isMultiModule;
    const moduleName = task.moduleName;
    const outputPath = path_1.default.join(task.outputDirectory, outputName + ".zip");
    const output = fs_1.default.createWriteStream(outputPath);
    const archive = (0, archiver_1.default)("zip");
    const zipDirectory = path_1.default.join(task.tempDirectory, task.widgetDirectoryName);
    output.on("close", function () {
        info("Created zip file: " + outputPath);
        end(operation);
        const message = _isMultiWidgetMode
            ? outputPath + "\n"
            : "\nWidget package file location:\n" + outputPath;
        exitSuccess(message, true);
    });
    archive.on("error", function (err) {
        error("Failed to create zip file: " + outputPath + " " + JSON.stringify(err));
        end(operation);
        exitError("");
    });
    let includeList = ["widget.manifest"];
    if (!task.isExternal) {
        includeList.push(isMultiModule ? widgetId + "." + moduleName + ".js" : moduleName + ".js");
        if (sharedModules && sharedModules.length) {
            includeList = includeList.concat(sharedModules.map((module) => {
                const path = module.path;
                if (path) {
                    return path.substr(path.lastIndexOf("/", path.length) + 1) + ".js";
                }
                else {
                    return module.name + ".js";
                }
            }));
        }
        verifyFinalScriptFiles(task, includeList);
    }
    const allowedExtensions = ["*.png", "*.jpg", "*.gif", "*.svg"];
    archive.glob("*", {
        cwd: zipDirectory,
        pattern: [...includeList, ...allowedExtensions],
    });
    archive.pipe(output);
    archive.finalize();
}
function verifyFinalScriptFiles(task, filenames) {
    for (const filename of filenames) {
        const filePath = path_1.default.join(task.widgetTempDirectory, filename);
        if (!fs_extra_1.default.existsSync(filePath)) {
            exitError("Mandatory file not found, expected: " + filePath);
            return;
        }
        trace("Verified mandatory file file: " + filename);
    }
}
function resolveWidgetDirectory(task) {
    const widgetParameter = task.widgetParameter;
    const operation = begin("Resolve widget directory");
    let searchDirectory = widgetParameter;
    let widgetDirectory;
    if (fs_extra_1.default.existsSync(searchDirectory)) {
        widgetDirectory = searchDirectory;
    }
    if (!widgetDirectory && task.basePath) {
        searchDirectory = path_1.default.join(task.basePath, widgetParameter);
        if (fs_extra_1.default.existsSync(searchDirectory)) {
            widgetDirectory = searchDirectory;
        }
    }
    if (!widgetDirectory) {
        searchDirectory = path_1.default.join(task.scriptDirectory, widgetParameter);
        if (fs_extra_1.default.existsSync(searchDirectory)) {
            widgetDirectory = searchDirectory;
        }
    }
    if (!widgetDirectory) {
        searchDirectory = path_1.default.join(path_1.default.join(task.scriptDirectory, "Widgets"), widgetParameter);
        if (fs_extra_1.default.existsSync(searchDirectory)) {
            widgetDirectory = searchDirectory;
        }
    }
    if (!widgetDirectory) {
        error("Widget directory not found for " + widgetParameter);
        deleteTempDirectories();
        exitWithUsage(1);
        return;
    }
    task.widgetDirectory = widgetDirectory;
    info("Widget directory resolved to: " + widgetDirectory);
    end(operation);
}
function resolveRelativeDirectoryLocation(basePath, testPath) {
    let directory = path_1.default.join(basePath, testPath);
    if (fs_extra_1.default.existsSync(directory)) {
        return "./";
    }
    let relativeDirectory = "";
    while (true) {
        relativeDirectory += "../";
        const relativeBaseDirectory = path_1.default.join(basePath, relativeDirectory);
        if (!path_1.default.basename(relativeBaseDirectory) ||
            !fs_extra_1.default.existsSync(relativeBaseDirectory)) {
            break;
        }
        directory = path_1.default.join(relativeBaseDirectory, testPath);
        if (fs_extra_1.default.existsSync(directory)) {
            return relativeDirectory;
        }
    }
    return null;
}
function resolveRelativeNodeModulesPath(task) {
    if (_completedTask) {
        task.relativeNodeModulesPath = _completedTask.relativeNodeModulesPath;
        task.absoluteNodeModulesPath = _completedTask.absoluteNodeModulesPath;
        return;
    }
    const operation = begin("Resolve node_modules path");
    const basePath = __dirname;
    const testPath = "node_modules";
    const relativeDirectory = resolveRelativeDirectoryLocation(basePath, testPath);
    if (relativeDirectory) {
        task.relativeNodeModulesPath = relativeDirectory;
        task.absoluteNodeModulesPath = path_1.default.join(path_1.default.join(basePath, relativeDirectory), testPath);
        info("Resolved relative node_modules path: " + relativeDirectory);
        info("Resolved absolute node_modules path: " + task.absoluteNodeModulesPath);
    }
    else {
        exitError("Failed to resolve the path to the node_modules directory. The node_modules directory must exist in the same directory as this script or in a parent directory of this script.");
        return;
    }
    end(operation);
}
function validateScreenshots(task) {
    const numScreenshots = task.manifest.screenshots;
    if (numScreenshots !== undefined) {
        info("Validating screenshots...");
        if (!Number.isInteger(numScreenshots)) {
            exitError("The 'screenshots' manifest property must be a number.");
        }
        if (numScreenshots < 1 || numScreenshots > 3) {
            exitError(`Invalid number of screenshots: ${numScreenshots}. Expected: 1, 2 or 3`);
        }
        const screenshotFiles = fs_1.default
            .readdirSync(task.widgetDirectory)
            .filter((filename) => filename.match(/^screenshot\d*\.png$/));
        if (screenshotFiles.length !== numScreenshots) {
            exitError(`Manifest declares ${numScreenshots} screenshot(s), but the directory contains ${screenshotFiles.length} file(s) with valid names for screenshots.`);
        }
        screenshotFiles.forEach((filename) => {
            const maxSizeKB = 100;
            const filePath = path_1.default.join(task.widgetDirectory, filename);
            const stats = fs_1.default.statSync(filePath);
            const sizeKB = stats.size / 1000;
            if (sizeKB > maxSizeKB) {
                exitError(`Screenshot file ${filename} is too large (${sizeKB}KB). Maximum allowed is ${maxSizeKB}KB`);
            }
        });
    }
}
function validateWidgetId(task) {
    const widgetId = task.manifest.widgetId;
    if (widgetId.length > 64) {
        error("Widget id " +
            widgetId +
            " exceeds max length 64, recommended length is max 30");
    }
    const messageInfo = "Check the Developers Guide documentation for more information. Use lower case letters and dots.\n";
    const simpleReg = new RegExp(WidgetIdPattern);
    if (!simpleReg.test(widgetId)) {
        exitError("\nERROR: \nThe widget id " +
            widgetId +
            " has an invalid format. " +
            messageInfo);
    }
    else {
        const strictReg = new RegExp(WidgetIdPatternStrict);
        if (!strictReg.test(widgetId)) {
            error("\nWARNING: \nThe widget id " +
                widgetId +
                " does not have the recommended format. If this is new widget the widget id MUST be changed. " +
                messageInfo);
        }
    }
}
function validWidgetDirectoryPath(directory) {
    if (directory.indexOf(" ") >= 0) {
        const message = "Spaces are not allowed in the widget directory path.\n" +
            "Make sure that the following path do not contain any spaces:\n" +
            directory;
        exitError(message);
    }
}
function hasIFrame(task) {
    return hasIFrameRecursive(task, task.widgetDirectory);
}
function hasIFrameRecursive(task, directory) {
    const names = fs_1.default.readdirSync(directory);
    for (const name of names) {
        const filePath = path_1.default.join(directory, name);
        const isFolder = fs_1.default.statSync(filePath).isDirectory();
        if (isFolder && hasIFrameRecursive(task, filePath)) {
            return true;
        }
        else {
            if (name.endsWith(".ts") ||
                name.endsWith(".js") ||
                name.endsWith(".html")) {
                const code = fs_1.default.readFileSync(filePath, "utf8");
                const index = code.includes("iframe");
                if (index) {
                    return true;
                }
            }
        }
    }
    return false;
}
function validate(task) {
    resolveWidgetDirectory(task);
    const operation = begin("Validate");
    const widgetDirectory = task.widgetDirectory;
    validWidgetDirectoryPath(widgetDirectory);
    const manifest = getManifest(widgetDirectory);
    task.manifest = manifest;
    validateScreenshots(task);
    validateWidgetId(task);
    executeInitialize(task);
    if (manifest.type !== "inline") {
        task.isExternal = true;
    }
    if (manifest.type === "inline" && !hasIFrame(task)) {
        task.isNativeInline = true;
    }
    info("Type: " + (task.isExternal ? "external" : "inline"));
    if (!manifest.moduleName) {
        manifest.moduleName = "widget";
    }
    task.moduleName = manifest.moduleName;
    info("Widget module name: " + task.moduleName);
    task.widgetDirectoryName = path_1.default.basename(task.widgetDirectory);
    const widgetId = manifest.widgetId;
    if (getBooleanArg("validateDirectory", true)) {
        if (task.widgetDirectoryName !== widgetId) {
            error("Widget source code must be located in a folder with the same name as the widget id (" +
                widgetId +
                "). \n\nThis script cannot be used unless the folder: " +
                task.widgetDirectoryName +
                " is changed to: " +
                widgetId);
            exitWithUsage(1);
            return;
        }
    }
    const sharedModules = manifest.sharedModules;
    if (sharedModules) {
        for (const sharedModule of sharedModules) {
            task.sharedModules.push(sharedModule);
        }
    }
    task.displayVersion = manifest.version + "." + getTimestamp();
    end(operation);
}
function getBuildTasksArray(task) {
    const tasks = [];
    const widgets = getArg("widgets");
    if (widgets) {
        trace("widgets parameter: " + widgets);
    }
    const widgetParameter = task.widgetParameter;
    const multiWidgetParameter = getArg("widgets");
    if (!widgetParameter && !multiWidgetParameter) {
        error("No widget specified");
        exitWithUsage(1);
        return;
    }
    if (widgetParameter && multiWidgetParameter) {
        error("Invalid parameters. Using the default or the widget parameter and the widgets paramameter is not allowed.");
        exitWithUsage(1);
        return;
    }
    if (widgets && widgets.length > 0) {
        const widgetArray = widgets.split(",");
        const resultArray = [];
        widgetArray.forEach((widgetDirectory) => {
            const trimmed = widgetDirectory.trim();
            if (trimmed.length > 0 && !trimmed.startsWith("_lime_temp_")) {
                resultArray.push(trimmed);
            }
        });
        const count = resultArray.length;
        if (count == 0) {
            trace("widgets parameter is used but one or no widget");
        }
        else if (count == 1) {
            trace("widgets parameter is used with single widget");
        }
        for (const widget of resultArray) {
            const newTask = JSON.parse(JSON.stringify(task));
            newTask.widgetParameter = widget;
            tasks.push(newTask);
        }
    }
    else {
        task.widgetParameter = widgetParameter;
        tasks.push(task);
    }
    return tasks;
}
function createTempDirectory(task) {
    const name = "_lime_temp_" + new Date().getTime();
    const directory = path_1.default.join(path_1.default.join(task.widgetDirectory, "../", name));
    createDirectory(directory);
    task.tempDirectory = directory;
    task.widgetTempDirectory = path_1.default.join(directory, task.widgetDirectoryName);
    _tempDirectory = directory;
}
function resolveOutputDirectory(task) {
    if (_completedTask) {
        task.outputDirectory = _completedTask.outputDirectory;
        return;
    }
    const operation = begin("Resolve output directory");
    let directory = getArg("outputPath");
    if (directory) {
        createDirectory(directory);
        if (fs_extra_1.default.existsSync(directory)) {
            task.outputDirectory = directory;
        }
    }
    if (!task.outputDirectory) {
        directory = path_1.default.join(task.scriptDirectory, "Builds");
        createDirectory(directory);
        task.outputDirectory = directory;
    }
    info("Output directory resolved to: " + directory);
    end(operation);
}
function copyBuildFiles(task) {
    const sourceDir = task.widgetDirectory;
    const targetDir = path_1.default.join(task.tempDirectory, task.widgetDirectoryName);
    const tempDirectoryName = path_1.default.basename(task.tempDirectory);
    const options = {
        dereference: true,
        filter: (name) => {
            return !(name.indexOf("_lime_temp_") >= 0);
        },
    };
    (0, ncp_1.default)(sourceDir, targetDir, options, async (err) => {
        if (err) {
            error("Failed to copy files " + err);
            exitWithUsage(1);
            return;
        }
        await packBuild(task);
    });
}
function executeInitialize(task) {
    task.isMultiModule = true;
}
function executeResolve(task) {
    resolveRelativeNodeModulesPath(task);
    resolveOutputDirectory(task);
}
async function executeBundle(task) {
    const sharedModules = task.sharedModules;
    if (sharedModules) {
        for (const sharedModule of sharedModules) {
            await bundleWithRollup(task, sharedModule);
        }
    }
    await bundleWithRollup(task);
}
function executeManifestUpdate(task) {
    if (task.isMultiModule) {
        updateManifest(task);
    }
}
function executeZip(task) {
    if (task.isZip) {
        packZip(task);
    }
}
async function packBuild(task) {
    try {
        executeResolve(task);
        if (!task.isExternal) {
            await executeBundle(task);
        }
        else {
            info("Build phase skipped for external widget");
        }
        executeManifestUpdate(task);
        executeZip(task);
    }
    catch (ex) {
        exitError(ex);
    }
}
function pack(task) {
    if (_isMultiWidgetMode) {
        info("");
        info("Package");
        info("-------");
        info("Widget package: " + task.widgetParameter);
    }
    validate(task);
    createTempDirectory(task);
    copyBuildFiles(task);
}
function deleteTempDirectories() {
    if (!getBooleanArg("clearTemp", true)) {
        return;
    }
    for (const tempDir of tempDirsToRemove) {
        try {
            if (!tempDir || !fs_extra_1.default.existsSync(tempDir)) {
                continue;
            }
            const operation = begin("Delete temporary directory");
            fs_extra_1.default.removeSync(tempDir);
            info("Deleted directory: " + tempDir);
            end(operation);
        }
        catch (ex) {
            error("Failed to delete temporary directory: " + tempDir + " - " + ex);
        }
    }
}
function generateManifestTypes(task) {
    resolveWidgetDirectory(task);
    const fileContent = createFileContent();
    writeToFile("manifest-types.d.ts", fileContent);
    function createFileContent() {
        let result = "";
        const { language, settings } = parseManifest();
        result += addHeader();
        result += addImports();
        result += addLanguageInterface(language);
        result += addSettingsInterface(settings);
        return result;
    }
    function parseManifest() {
        const manifest = getManifest(task.widgetDirectory);
        return {
            language: parseLanguage(manifest),
            settings: parseSettings(manifest),
        };
    }
    function parseLanguage(manifest) {
        if (manifest && manifest.localization && manifest.localization["en-US"]) {
            return manifest.localization["en-US"];
        }
        else {
            info("en-US localization not found in manifest. Language constants will not be generated.");
            return {};
        }
    }
    function parseSettings(manifest) {
        if (manifest.settings && manifest.settings.length) {
            return manifest.settings;
        }
        else {
            info("Manifest does not contain any settings. Settings constants will not be generated.");
            return [];
        }
    }
    function addHeader() {
        let result = "";
        result +=
            "// NOTE: This file has been automatically generated. It should never be manually edited.\n";
        return result;
    }
    function addImports() {
        let result = "";
        result += `import { ILanguage } from "lime";\n`;
        return result;
    }
    function addLanguageInterface(localization) {
        let result = "";
        result +=
            "export interface IManifestLanguage extends ILanguage<IManifestLanguage> {\n";
        Object.keys(localization)
            .sort(sortAlphabetically)
            .forEach((localizationKey) => {
            result += formattedInterfaceProperty(localizationKey, "string", localization[localizationKey]);
        });
        result += "}\n";
        return result;
    }
    function addSettingsInterface(settings) {
        let result = "";
        result += "export interface IManifestSettings {\n";
        settings.sort(sortSettingsAlphabetically).forEach((setting) => {
            result += formattedInterfaceProperty(setting.name, mapSettingType(setting.type), `Type: ${setting.type}`);
        });
        result += "}\n";
        return result;
        function mapSettingType(settingType) {
            switch (settingType) {
                case "boolean":
                    return settingType;
                case "number":
                    return settingType;
                case "string":
                    return settingType;
                case "object":
                    return "any";
                case "radio":
                    return "any";
                case "selector":
                    return "any";
                default:
                    return "any";
            }
        }
    }
    function formattedInterfaceProperty(name, type = "unknown", comment) {
        let result = "";
        if (comment) {
            result += `\t/** ${escape(comment)} */\n`;
        }
        result += `\t${escape(name)}: ${type};\n`;
        return result;
    }
    function escape(text) {
        if (text.length) {
            return JSON.stringify(text).replace(/^\"(.+)\"$/, "$1");
        }
        else {
            return "";
        }
    }
    function writeToFile(filename, content) {
        const filePath = path_1.default.join(task.widgetDirectory, filename);
        info(`Writing to ${filePath}`);
        fs_1.default.writeFileSync(filePath, content, { encoding: "utf8" });
    }
    function sortSettingsAlphabetically(settingA, settingB) {
        return sortAlphabetically(settingA.name, settingB.name);
    }
    function sortAlphabetically(a, b) {
        return a.localeCompare(b);
    }
}
function _exit(code) {
    process.exit(code);
}
function exitSuccess(message, isFinalMessage) {
    if (message && !isFinalMessage) {
        info(message);
    }
    tempDirsToRemove.push(_tempDirectory);
    if (_isMultiWidgetMode) {
        _finalSuccessMessage = _finalSuccessMessage + message;
    }
    _completedTask = _buildTasksArray.shift();
    const isCompleted = _buildTasksArray.length == 0;
    if (isCompleted) {
        deleteTempDirectories();
        info("");
        info("Command completed successfully.");
        info("");
    }
    if (message && isFinalMessage && !isCompleted) {
        info(message);
    }
    if (!isCompleted) {
        const nextTask = _buildTasksArray[0];
        pack(nextTask);
    }
    else {
        if (_isMultiWidgetMode) {
            info("");
            info("Summary");
            info("-------");
            info("Widget package file location:\n");
            info(_finalSuccessMessage);
        }
        else {
            info(message + "\n");
        }
        info("");
        _exit(0);
    }
}
function exitError(message) {
    error("");
    if (typeof message === "object") {
        if (message.message) {
            error(message.message);
        }
        if (message.stack) {
            error(message.stack);
        }
    }
    else if (typeof message === "string") {
        error(message);
    }
    tempDirsToRemove.push(_tempDirectory);
    deleteTempDirectories();
    error("");
    error("Command completed with errors.");
    error("");
    if (_isMultiWidgetMode && _finalSuccessMessage.length > 0) {
        info("Build cancelled due to an error. The following build(s) completed:");
        info(_finalSuccessMessage);
    }
    _exit(1);
}
function exitWithUsage(code) {
    printUsage();
    _exit(code);
}
function info(message) {
    if (!_silent) {
        console.log(message);
    }
}
function warn(message) {
    console.warn(message);
}
function trace(...message) {
    if (!_silent && _trace) {
        console.log(...message);
    }
}
function error(message) {
    console.error(message);
}
function getBooleanArg(name, defaultValue) {
    const value = _argv[name];
    if (value == null || value === undefined) {
        return defaultValue;
    }
    return (value === true ||
        (value != null && value.toString().toLowerCase() === "true"));
}
function getArg(name) {
    const value = _argv[name];
    return value != null ? value.toString() : value;
}
function printUsage() {
    info("");
    info("Usage");
    info("-----");
    info("node homepages [command] [parameters]");
    info("");
    info("Commands:");
    info("pack                Builds, minifies, bundles and creates a widget zip package");
    info("generate-types      Generate TypeScript types from manifest");
    info("help                Prints usage information");
    info("");
    info("Parameters:");
    info("--widget            The directory name of a widget. Directory names can be absolute or relative.");
    info("--widgets           One or more widget directory names separated by comma (,). Directory names can be absolute or relative.");
    info("--outputPath        The path to directory where the widget zip file will be created. Default: ./Builds");
    info("--basePath          Optional base path used to resolve relative widget directory paths.");
    info("--addDisplayVersion Adds or updates the displayVersion property in the widget manifest. Default: false");
    info("");
    info("Advanced parameters:");
    info("--clearTemp               Clears the temporary directory after command completion. Default: true");
    info("--mangle                  Mangles the JavaScript code. Default: true");
    info("--minify                  Minifies the JavaScript code. Default: true");
    info("--silent                  Run in silent mode with minimal console output. Default: false");
    info("--trace                   Output trace information to the console. Default: false");
    info("--zip                     Creates the widget zip packages. Default: true");
    info("--fullTemplateTypeCheck   Perform full Angular AOT template checks. Default: false");
    info("--asTenant                Pack the widget as an unsigned Tenant Widget for testing purposes. Default: false");
    info("");
    info("Examples");
    info("--------");
    info('node homepages pack --widget "Widgets/infor.sample.angular.helloworld" --outputPath "C:\\Builds"');
    info('node homepages pack --widget "C:\\\\Source\\Widgets\\infor.sample.angular.helloworld" --outputPath "C:\\Builds"');
    info('node homepages pack "Widgets/infor.sample.angular.helloworld"');
    info('node homepages generate-types "Widgets/infor.sample.angular.helloworld"');
    info("");
    info("Advanced examples");
    info("-----------------");
    info("Build troubleshooting example that keeps the build output in the temp directory.");
    info('node homepages pack "Widgets/infor.sample.angular.helloworld" --clearTemp=false --zip=false --trace');
    info("");
}
function start() {
    info("");
    info("Homepages SDK");
    info("=============");
    const argv = (0, minimist_1.default)(process.argv.slice(2));
    const commands = argv._;
    if (commands.length == 0) {
        error("No command specified");
        printUsage();
        _exit(1);
        return;
    }
    const command = commands[0];
    info("Command: " + command);
    _argv = argv;
    _trace = getBooleanArg("trace", false);
    _silent = getBooleanArg("silent", false);
    const commandValue = commands.length > 1 ? commands[1] : null;
    const widgetParameter = argv.widget || commandValue;
    let task = {
        argv: argv,
        command: command,
        commandValue: commandValue,
        scriptDirectory: __dirname,
        sharedModules: [],
        isMinify: getBooleanArg("minify", true),
        isMangle: getBooleanArg("mangle", true),
        isZip: getBooleanArg("zip", true),
        widgetParameter: widgetParameter,
        basePath: getArg("basePath"),
    };
    if (command == "help") {
        printUsage();
        _exit(0);
    }
    if (task.basePath && !fs_extra_1.default.existsSync(task.basePath)) {
        error("Base path not found: " + task.basePath);
        exitWithUsage(1);
        return;
    }
    if (command == "pack") {
        _buildTasksArray = getBuildTasksArray(task);
        _isMultiWidgetMode = _buildTasksArray.length > 1;
        task = _buildTasksArray[0];
        pack(task);
    }
    else if (command === "generate-types") {
        _buildTasksArray = getBuildTasksArray(task);
        task = _buildTasksArray[0];
        generateManifestTypes(task);
    }
    else {
        error('The command "' + command + '" is not supported');
        exitWithUsage(1);
    }
}
start();

#!/usr/bin/env node
import cp from "child_process";
import fs from "fs";
import path from "path";

const cliTarball = fs
	.readdirSync("packed")
	.sort() // Sort for semantic versioning
	.reverse() // Reverse to get latest versions first
	.find((file) => file.startsWith("infor-lime-cli"));
if (!cliTarball) {
	throw new Error("Could not find CLI tarball");
}
const cliTarballPath = path.resolve("packed", cliTarball);
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

console.log(`Installing CLI from file ${cliTarballPath}...`);
cp.execSync(`${npm} install -g ${cliTarballPath}`, { stdio: "inherit" });

try {
	console.log("Verifying installation...");
	cp.execSync("lime --help", { stdio: "ignore" });
} catch (e) {
	console.error(
		"Failed to verify installation. The lime command is not available.",
	);
	process.exit(1);
}

console.log("");
console.log("===============================================");
console.log("Installation complete!");
console.log("Run 'lime help' for usage instructions");
console.log(`To create a new project, run:`);
console.log(`    lime init my-project-name`);
console.log(`To update an existing project, run:`);
console.log(`    lime update`);

console.log("===============================================");
console.log("");

[
	"infor-lime-cli-1.0.0-rc.0.tgz",
	"infor-lime-core-1.0.0-rc.0.tgz",
	"infor-lime-eslint-plugin-1.0.0-rc.0.tgz",
	"infor-lime-runtime-1.0.0-rc.0.tgz",
	"infor-lime-cli-1.0.0-rc.1.tgz",
	"infor-lime-core-1.0.0-rc.1.tgz",
	"infor-lime-eslint-plugin-1.0.0-rc.1.tgz",
	"infor-lime-runtime-1.0.0-rc.1.tgz",
].rev;

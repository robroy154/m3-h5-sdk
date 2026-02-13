# Widget SDK

## Important Information

Web technologies are evolving and changing rapidly. Due to the constant updates of third-party dependencies, it is crucial to verify your widgets against a new SDK as soon as it becomes available, at least once every feature release, or twice a year, and address any warnings or issues. As technology continues to change, Infor does not guarantee that a widget will be compatible with more than one feature release of the applicable Infor products or services, which are released in April and October. Infor is not responsible for any technical difficulties or data loss that occurs through the use of SDK widgets.

## Installation

Run the `install-cli.mjs` script to install the CLI globally.

```bash
./install-cli.mjs

# ...or
node ./install-cli.mjs
```

## Upgrading

1. Unzip the new SDK to some directory.
2. Run the install script, e.g `./install-cli.mjs` or `node ./install-cli.mjs`. This will upgrade your global CLI installation.
3. In your project, run `lime update`. This will update the local CLI installation and other dependencies to match the global version.
4. Run `lime version` to verify that the expected version is installed.

## Usage

Once installed, you can run the `lime` command to see the available commands.

```bash
lime help
```

## Samples

The `samples` directory contain sample widgets that can be copied into a project. For example, to copy and run a sample:

```bash
# First copy the sample widget
cp -r samples/infor.sample.angular.helloworld /path/to/my-project

# Then navigate to the project directory
cd /path/to/my-project

# Then start the dev server
lime serve infor.sample.angular.helloworld
```

Alternatively, you can copy the whole `samples` directory into your project:

```bash
# Copy all the samples
cp -r samples /path/to/my-project

# Then navigate to the project directory
cd /path/to/my-project

# Then start the dev server
lime serve samples/infor.sample.angular.helloworld
```

## Guidelines

### Widget ID of the widget

- The Widget ID should be in lowercase words separated by dots
- Max length of Widget ID should be 64
- The Widget ID must be unique among all widgets

### Title of widget

- Title should be short, direct and gives an idea of the widgets purpose
- Max length of title should be 40
- Avoid using “Infor” within the title
- The widget title should not contain the word Widget

### Description of the widget

- The widget description should not start with “This widget”, “This app”
- Max length of description should be 1024

---

Copyright © 2025 Infor. All rights reserved. www.infor.com

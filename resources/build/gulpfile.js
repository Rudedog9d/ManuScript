//Dependencies
const exec = require("child_process").exec;
const gulp = require("gulp");

//Constants
const C = {
    AUTHOR: "Brodie Davis",
    ORIGINAL_AUTHOR: "Geoffrey Mattie",
    TITLE: "ManuScript Personal Journal",
    WINDOWS_METADATA: "win32metadata"
};

//Paths
const Path = {
    ICON: "../source/images/icons/",
    OUT: "./releases/"
};

//Commands
const Command = {
    APP_BUNDLE_ID: `--app-bundle-id=com.mattie.DataPixelsPlayground`,
    ARCH: `--arch=x64`,
    ASAR: `--asar`,
    BASE: `electron-packager ./ --overwrite`,
    COMPANY_NAME: `--${C.WINDOWS_METADATA}.CompanyName="${C.AUTHOR}"`,
    COPYRIGHT: `--app-copyright="Copyright © 2017 ${C.AUTHOR}"`,
    FILE_DESCRIPTION: `--${C.WINDOWS_METADATA}.FileDescription="${C.TITLE}"`,
    ICON: `--icon=`,
    ORIGINAL_FILE_NAME: `--${C.WINDOWS_METADATA}.OriginalFilename="${C.TITLE}"`,
    OUT: `--out="${Path.OUT}"`,
    PLATFORM: `--platform=`,
    PRODUCT_NAME: `--${C.WINDOWS_METADATA}.ProductName="${C.TITLE}"`
};

//Platforms
const Platform = {
    LINUX: "linux",
    MAC: "darwin",
    WINDOWS: "win32"
};

//Icons
const Icon = {
    ALL: `${Command.ICON}${Path.ICON}icon.*`,
    LINUX: `${Command.ICON}${Path.ICON}icon.png`,
    MAC: `${Command.ICON}${Path.ICON}icon.icns`,
    WINDOWS: `${Command.ICON}${Path.ICON}icon.ico`    
};

//Tasks
const tasks = {
    PACKAGE: "package",
    PACKAGE_LINUX: "package-linux",
    PACKAGE_MAC: "package-mac",
    PACKAGE_WINDOWS: "package-windows"
};

//Task Package
gulp.task(tasks.PACKAGE, () => {
    const metadata = `${Command.APP_BUNDLE_ID} ${Command.PRODUCT_NAME} ${Command.COMPANY_NAME} ${Command.FILE_DESCRIPTION} ${Command.ORIGINAL_FILE_NAME}`;
    const command = `${Command.PLATFORM}${Platform.LINUX},${Platform.MAC},${Platform.WINDOWS} ${metadata} ${Icon.ALL}`;

    executePackager(command);
});

//Task Package Linux
gulp.task(tasks.PACKAGE_LINUX, () => {
    const command = `${Command.PLATFORM}${Platform.LINUX} ${Icon.LINUX}`;

    executePackager(command);
});

//Task Package Mac
gulp.task(tasks.PACKAGE_MAC, () => {
    const metadata = `${Command.APP_BUNDLE_ID}`;
    const command = `${Command.PLATFORM}${Platform.MAC} ${metadata} ${Icon.MAC}`;

    executePackager(command);
});

//Task Package Windows
gulp.task(tasks.PACKAGE_WINDOWS, () => {
    const metadata = `${Command.PRODUCT_NAME} ${Command.COMPANY_NAME} ${Command.FILE_DESCRIPTION} ${Command.ORIGINAL_FILE_NAME}`;
    const command = `${Command.PLATFORM}${Platform.WINDOWS} ${metadata} ${Icon.WINDOWS}`;

    executePackager(command);
});

//Execute Packager
function executePackager(platformCommand) {

    const baseCommand = `${Command.BASE} ${Command.ASAR} ${Command.ARCH} ${Command.COPYRIGHT} ${Command.OUT}`;

    exec(`${baseCommand} ${platformCommand}`, (error, stdout, stderr) => {

        if (error) {

            console.error(error);
            return;
        }

        console.log(stdout);
        console.log(stderr);
    });
}
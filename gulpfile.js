//Dependencies
const autoPrefixer = require("autoprefixer");
const browserSync = require("browser-sync").create();
const concat = require('gulp-concat');
const declare = require('gulp-declare');
const del = require("del");
const exec = require("child_process").exec;
const gulp = require("gulp");
const gulpUtil = require("gulp-util");
const handlebars = require('gulp-handlebars');
const minCSS = require("gulp-clean-css");
const minHTML = require("gulp-htmlmin");
const path = require('path');
const postCSS = require("gulp-postcss");
const sass = require("gulp-sass");
const sourceMaps = require("gulp-sourcemaps");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const webpackUglify = require("uglifyjs-webpack-plugin");
const wrap = require('gulp-wrap');


// Define Build Constants
const C = {
    AUTHOR: "Brodie Davis",
    TITLE: "ManuScript Personal Journal",
    WINDOWS_METADATA: "win32metadata"
};

// Convert CLI args to Config object
const config = {
    // If --development not specified, assume production mode
    DEVELOPMENT: gulpUtil.env.development,
    PRODUCTION: !gulpUtil.env.development
};

//Tasks
const tasks = {
    // Compile all files
    BUILD: "build",
    // Delete compiled files
    CLEAN: "clean",
    // Run in browser (dev mode)
    RUN: "run",
    // Package ALL OS's
    PACKAGE: "package",
    // Create Linux Release
    PACKAGE_LINUX: "package-linux",
    // Create MAC Release
    PACKAGE_MAC: "package-mac",
    // Create Windows Release
    PACKAGE_WINDOWS: "package-windows"
};

//Paths
var paths = {};
paths.ROOT   = path.join(__dirname, "resources");
paths.OUT    = path.join(__dirname, "releases");
paths.BUILD  = path.join(paths.ROOT, "build");
paths.SOURCE = path.join(paths.ROOT, "source");
paths.ICON   = path.join(paths.ROOT, "source", "images", "icons");

//Folders todo: make this better
const folders = {
    JS: "js",
    CSS: "css",
    SASS: "sass"
};

//Files todo: make this better
const files = {
    JS: "main.js",
    CSS: "main.css",
    SASS: "manuscript.scss",
    HTML: "index.html"
};

// Build Commands
const Command = {
    APP_BUNDLE_ID: `--app-bundle-id=com.ManuScriptPersonalJournal`,
    ARCH: `--arch=x64`,
    ASAR: `--asar`,
    BASE: `electron-packager ./ --overwrite`,
    COMPANY_NAME: `--${C.WINDOWS_METADATA}.CompanyName="${C.AUTHOR}"`,
    COPYRIGHT: `--app-copyright="Copyright © 2017 ${C.AUTHOR}"`,
    FILE_DESCRIPTION: `--${C.WINDOWS_METADATA}.FileDescription="${C.TITLE}"`,
    ICON: `--icon=`,
    ORIGINAL_FILE_NAME: `--${C.WINDOWS_METADATA}.OriginalFilename="${C.TITLE}"`,
    OUT: `--out="${paths.OUT}"`,
    PLATFORM: `--platform=`,
    PRODUCT_NAME: `--${C.WINDOWS_METADATA}.ProductName="${C.TITLE}"`
};

/************ Build Constants *************/
// Build Icons
const BuildIcons = {
    ALL: `${Command.ICON}${paths.ICON}/icon.*`,
    LINUX: `${Command.ICON}${paths.ICON}/icon.png`,
    MAC: `${Command.ICON}${paths.ICON}/icon.icns`,
    WINDOWS: `${Command.ICON}${paths.ICON}/icon.ico`
};

//Build Platforms
const Platform = {
    LINUX: "linux",
    MAC: "darwin",
    WINDOWS: "win32"
};

/************ Functions *************/
//Execute Packager
function _package(platformCommand) {
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

// Clean files from directory
function _clean_files(dir) {
    gulpUtil.log(`Removing files from ${dir}`);
    return del([dir])
}

// Transpile JavaScript
function transpileJs(){
    gulp.src(`${paths.SOURCE}/${folders.JS}/${files.JS}`)
        .pipe(
            webpackStream({
                module: {
                    rules: [{
                        test: /\.js$/,
                        loader: "babel-loader",
                        exclude: /(node_modules)/,
                        options: {
                            presets: [["latest", {"es2015": {"modules": false}}]]
                        }
                    }]
                },
                plugins: (config.PRODUCTION) ? [new webpackUglify({
                        compress: {warnings: true},
                        sourceMap: (config.DEVELOPMENT)})
                    ]
                    : [],
                output: {filename: `${files.JS}`},
                devtool: (config.DEVELOPMENT) ? "inline-source-map" : ""
            }, webpack)
                .on("error", (error) => gulpUtil.log(error)))
        .pipe(gulp.dest(`${paths.BUILD}/${folders.JS}`))
        .pipe((config.DEVELOPMENT) ? browserSync.stream() : gulpUtil.noop());
}

// Transpile Sass
function transpileCss(){
    gulp.src(`${paths.SOURCE}/${folders.SASS}/${files.SASS}`)
        .pipe((config.DEVELOPMENT) ? sourceMaps.init() : gulpUtil.noop())
        .pipe(
            sass({
                outFile: `${files.CSS}`
            })
                .on("error", sass.logError))
        .pipe(
            postCSS([
                autoPrefixer()
            ]))
        .pipe((config.PRODUCTION) ? minCSS() : gulpUtil.noop())
        .pipe((config.DEVELOPMENT) ? sourceMaps.write() : gulpUtil.noop())
        .pipe(gulp.dest(`${paths.BUILD}/${folders.CSS}`))
        .pipe((config.DEVELOPMENT) ? browserSync.stream() : gulpUtil.noop());
}

// Build Handlebar Templates
function transpileTemplates(){
    gulp.src(`${paths.SOURCE}/templates/*.hbs`)
        .pipe(handlebars({
            handlebars: require('handlebars')
        }))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'ManuScript.templates',
            noRedeclare: true, // Avoid duplicate declarations
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest(`${paths.BUILD}/${folders.JS}`));
}

// Transpile HTML
function transpileHtml(){
    gulp.src(`${paths.SOURCE}/${files.HTML}`)
    // Only minify in Production mode
        .pipe((config.PRODUCTION) ? minHTML({collapseWhitespace: true}) : gulpUtil.noop())
        .pipe(gulp.dest(`${paths.BUILD}`))
        // Use BrowerSync if in Development mode
        .pipe((config.DEVELOPMENT) ? browserSync.stream() : gulpUtil.noop());
}

/************ Tasks *************/
// Task Package
gulp.task(tasks.PACKAGE, [tasks.CLEAN, tasks.BUILD], () => {
    const metadata = `${Command.APP_BUNDLE_ID} ${Command.PRODUCT_NAME} ${Command.COMPANY_NAME} ${Command.FILE_DESCRIPTION} ${Command.ORIGINAL_FILE_NAME}`;
    const command = `${Command.PLATFORM}${Platform.LINUX},${Platform.MAC},${Platform.WINDOWS} ${metadata} ${BuildIcons.ALL}`;

    _package(command);
});

// Task Package Linux
gulp.task(tasks.PACKAGE_LINUX, [tasks.CLEAN, tasks.BUILD], () => {
    const command = `${Command.PLATFORM}${Platform.LINUX} ${BuildIcons.LINUX}`;

    _package(command);
});

// Task Package Mac
gulp.task(tasks.PACKAGE_MAC, [tasks.CLEAN, tasks.BUILD], () => {
    const metadata = `${Command.APP_BUNDLE_ID}`;
    const command = `${Command.PLATFORM}${Platform.MAC} ${metadata} ${BuildIcons.MAC}`;

    _package(command);
});

// Task Package Windows
gulp.task(tasks.PACKAGE_WINDOWS, [tasks.CLEAN, tasks.BUILD], () => {
    const metadata = `${Command.PRODUCT_NAME} ${Command.COMPANY_NAME} ${Command.FILE_DESCRIPTION} ${Command.ORIGINAL_FILE_NAME}`;
    const command = `${Command.PLATFORM}${Platform.WINDOWS} ${metadata} ${BuildIcons.WINDOWS}`;

    _package(command);
});

// Task Clean Built Files
gulp.task(tasks.CLEAN, () => {
    _clean_files(`${paths.BUILD}/${folders.JS}/*.js`);
    _clean_files(`${paths.BUILD}/${folders.CSS}/*.css`);
    _clean_files(`${paths.BUILD}/*.html`);
});

// Task Compile everything
gulp.task(tasks.BUILD, () => {
    transpileJs();
    transpileCss();
    transpileTemplates();
    transpileHtml();
});

// Task Compile and Start Dev Server in browser
gulp.task(tasks.RUN, () => {
    gulp.start(tasks.BUILD);

    // Start Dev server (BrowserSync)
    browserSync.init({
        server: {
            baseDir: `${paths.BUILD}`,
            index: `${files.HTML}`
        }
    });

    // Watch Source files for changes
    gulp.watch(`${paths.SOURCE}/${folders.JS}/**/*.js`, transpileJs);
    gulp.watch(`${paths.SOURCE}/${folders.SASS}/**/*.scss`, transpileCss);
    gulp.watch(`${paths.SOURCE}/${files.HTML}`, transpileHtml);
    gulp.watch(`${paths.SOURCE}/templates/*.hbs`, transpileTemplates);
});


// Task Default - Start dev server
gulp.task("default", [tasks.RUN], () => {});

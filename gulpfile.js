//Dependencies
//Dependencies
const autoPrefixer = require("autoprefixer");
const browserSync = require("browser-sync").create();
const gulp = require("gulp");
const del = require("del");
const gulpUtil = require("gulp-util");
const minCSS = require("gulp-clean-css");
const minHTML = require("gulp-htmlmin");
const postCSS = require("gulp-postcss");
const sass = require("gulp-sass");
const sourceMaps = require("gulp-sourcemaps");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const webpackUglify = require("uglifyjs-webpack-plugin");
const exec = require("child_process").exec;
const handlebars = require('gulp-handlebars');
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const concat = require('gulp-concat');


//Constants
const C = {
    AUTHOR: "Brodie Davis",
    ORIGINAL_AUTHOR: "Geoffrey Mattie",
    TITLE: "ManuScript Personal Journal",
    WINDOWS_METADATA: "win32metadata"
};

//Config
const config = {
    CLEAN: gulpUtil.env.clean,
    DEVELOPMENT: gulpUtil.env.development,
    PRODUCTION: gulpUtil.env.production
};

//Tasks
const tasks = {
    TRANSPILE_HANDLEBARS: "tanspile-handlebars",
    TRANSPILE_JS: "transpile-js",
    TRANSPILE_SASS: "transpile-sass",
    TRANSPILE_HTML: "transpile-html",
    CLEAN: "clean",
    PACKAGE: "package",
    PACKAGE_LINUX: "package-linux",
    PACKAGE_MAC: "package-mac",
    PACKAGE_WINDOWS: "package-windows"
};

//Paths
const PATHS_ROOT = "./resources";

const paths = {
    ROOT: `${PATHS_ROOT}`,
    BUILD: `${PATHS_ROOT}/build`,
    SOURCE: `${PATHS_ROOT}/source`,
    ICON: `${PATHS_ROOT}/source/images/icons`,
    OUT: "./releases"
};

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
    APP_BUNDLE_ID: `--app-bundle-id=com.mattie.DataPixelsPlayground`,
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

/************ Tasks *************/
// Task Package
gulp.task(tasks.PACKAGE, () => {
    const metadata = `${Command.APP_BUNDLE_ID} ${Command.PRODUCT_NAME} ${Command.COMPANY_NAME} ${Command.FILE_DESCRIPTION} ${Command.ORIGINAL_FILE_NAME}`;
    const command = `${Command.PLATFORM}${Platform.LINUX},${Platform.MAC},${Platform.WINDOWS} ${metadata} ${BuildIcons.ALL}`;

    _package(command);
});

// Task Package Linux
gulp.task(tasks.PACKAGE_LINUX, () => {
    const command = `${Command.PLATFORM}${Platform.LINUX} ${BuildIcons.LINUX}`;

    _package(command);
});

// Task Package Mac
gulp.task(tasks.PACKAGE_MAC, () => {
    const metadata = `${Command.APP_BUNDLE_ID}`;
    const command = `${Command.PLATFORM}${Platform.MAC} ${metadata} ${BuildIcons.MAC}`;

    _package(command);
});

// Task Package Windows
gulp.task(tasks.PACKAGE_WINDOWS, () => {
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

// Task Transpile JavaScript
gulp.task(tasks.TRANSPILE_JS, () => {
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
});

// Task Transpile Sass
gulp.task(tasks.TRANSPILE_SASS, () => {
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
});

// Task Build Handlebar Templates
gulp.task(tasks.TRANSPILE_HANDLEBARS, () => {
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
});

// Task Transpile HTML
gulp.task(tasks.TRANSPILE_HTML, () => {
    gulp.src(`${paths.SOURCE}/${files.HTML}`)
        // Only minify in Production mode
        .pipe((config.PRODUCTION) ? minHTML({collapseWhitespace: true}) : gulpUtil.noop())
        .pipe(gulp.dest(`${paths.BUILD}`))
        // Use BrowerSync if in Development mode
        .pipe((config.DEVELOPMENT) ? browserSync.stream() : gulpUtil.noop());
});

// Task Default
gulp.task("default", [tasks.TRANSPILE_JS, tasks.TRANSPILE_SASS, tasks.TRANSPILE_HTML, tasks.TRANSPILE_HANDLEBARS], () => {
    if (config.DEVELOPMENT) {
        // Start Dev server (BrowserSync)
        browserSync.init({
            server: {
                baseDir: `${paths.BUILD}`,
                index: `${files.HTML}`
            }
        });

        // Watch Source files for changes
        gulp.watch(`${paths.SOURCE}/${folders.JS}/**/*.js`, [tasks.TRANSPILE_JS]);
        gulp.watch(`${paths.SOURCE}/${folders.SASS}/**/*.scss`, [tasks.TRANSPILE_SASS]);
        gulp.watch(`${paths.SOURCE}/${files.HTML}`, [tasks.TRANSPILE_HTML]);
        gulp.watch(`${paths.SOURCE}/templates/*.hbs`, [tasks.TRANSPILE_HANDLEBARS]);

    }
});
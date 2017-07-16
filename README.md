# **ManuScript - Personal Journaling Software**
Built using [Electron](https://electron.atom.io/) with love.

## **Install Node.js**
Installation of Node.js is required:  [**Download Here**](https://nodejs.org/en/)

## **Install Development Dependencies**
Installation of development dependencies (*Node Modules*) are required.  Enter the following CLI command at the project root folder to install:

```
npm install
```

## **Build**
The following build scripts can be executed by entering their CLI commands at the project root folder:

#### **Development**
```
npm run dev
```
- Transpiles JavaScript code and bundles modules to a single JavaScript file in the */build/js/* directory using [**Babel**](http://babeljs.io/) and [**Webpack**](https://webpack.js.org/). 
- Transpiles SASS code, adds vendor prefixes and bundles modules to a single CSS file in the */build/css/* directory using [**Gulp Sass**](https://github.com/dlmanning/gulp-sass) and [**Autoprefixer**](https://github.com/postcss/autoprefixer).
- Duplicates, minifies and moves the */source/index.html* file to the */build* directory using [**Gulp HTML Min**](https://github.com/jonschlinkert/gulp-htmlmin).
- Generates inline sourcemaps for JavaScript and SASS files using [**Gulp Sourcemaps**](https://github.com/floridoo/gulp-sourcemaps) and [**UgfifyJS Webpack Plugin**](https://github.com/webpack-contrib/uglifyjs-webpack-plugin).
- Opens the project in the default web browser, creates a local server and facilitates live reloading using [**Browsersync**](https://browsersync.io/).

#### **Production**
```
npm run prod
```
- Transpiles JavaScript code and bundles modules to a single, minified JavaScript file in the */build/js/* directory using [**Babel**](http://babeljs.io/), [**Webpack**](https://webpack.js.org/) and [**UgfifyJS Webpack Plugin**](https://github.com/webpack-contrib/uglifyjs-webpack-plugin).
- Transpiles SASS code, adds vendor prefixes and bundles modules to a single, minified CSS file in the */build/css/* directory using [**Gulp Sass**](https://github.com/dlmanning/gulp-sass), [**Autoprefixer**](https://github.com/postcss/autoprefixer) and [**Gulp Clean CSS**](https://github.com/scniro/gulp-clean-css).
- Duplicates, minifies and moves the */source/index.html* file to the */build* directory using [**Gulp HTML Min**](https://github.com/jonschlinkert/gulp-htmlmin).   

#### **Development & Production**
```
npm run dev-prod
```
- Transpiles JavaScript code and bundles modules to a single, minified JavaScript file in the */build/js/* directory using [**Babel**](http://babeljs.io/), [**Webpack**](https://webpack.js.org/) and [**UgfifyJS Webpack Plugin**](https://github.com/webpack-contrib/uglifyjs-webpack-plugin).
- Transpiles SASS code, adds vendor prefixes and bundles modules to a single, minified CSS file in the */build/css/* directory using [**Gulp Sass**](https://github.com/dlmanning/gulp-sass), [**Autoprefixer**](https://github.com/postcss/autoprefixer) and [**Gulp Clean CSS**](https://github.com/scniro/gulp-clean-css).
- Duplicates, minifies and moves the */source/index.html* file to the */build* directory using [**Gulp HTML Min**](https://github.com/jonschlinkert/gulp-htmlmin).
- Generates inline sourcemaps for JavaScript and SASS files using [**Gulp Sourcemaps**](https://github.com/floridoo/gulp-sourcemaps) and [**UgfifyJS Webpack Plugin**](https://github.com/webpack-contrib/uglifyjs-webpack-plugin).
- Opens the project in the default web browser, creates a local server and facilitates live reloading using [**Browsersync**](https://browsersync.io/).   

#### **Cleaning Build Directory**
```
npm run clean
```
 - Remove compiled files in build directory

#### **Building the Electron App** 
```bash
npm run prod        # From root of directory
cd resources/build
npm install         # Ensure build directory has deps installed
npm run build       # run the electron app
npm package-<OS>    # Package electron for the appropriate release
```
---
Build processes can be terminated by pressing `Ctrl+C` on the CLI of the project root folder.

## Credits

Many thanks to the following, for contributions in some way:
 - [Data-Pixels](https://github.com/gmattie/Data-Pixels)
 - [Project-Foundation](https://github.com/gmattie/Project-Foundation)
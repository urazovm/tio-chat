const ts = require('gulp-typescript');
const gulp = require('gulp');
const printFilenames = require( 'gulp-print' );
const inlineNg2Template = require('gulp-inline-ng2-template');
const htmlMinifier= require('html-minifier');
const uglify = require('gulp-uglify');
const concat = require( 'gulp-concat' );
const through = require('through2');
const Builder = require('systemjs-builder');
const runSequence = require('run-sequence');

const tscConfig = require('./tsconfig.json');
const rollup = require('gulp-rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const includePaths = require('rollup-plugin-includepaths');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');


gulp.task('js-with-rollup', ()=>{
  return gulp.src(['src/**/*.ts','!src/**/*.spec.ts'])
    .pipe(ts(tscConfig.compilerOptions))
    .pipe(gulp.dest('dist'))
    .pipe(rollup(
      {
        plugins: [
          nodeResolve({
            // use "jsnext:main" if possible
            // – see https://github.com/rollup/rollup/wiki/jsnext:main
            jsnext: true,  // Default: false

            // use "main" field or index.js, even if it's not an ES6 module
            // (needs to be converted from CommonJS to ES6
            // – see https://github.com/rollup/rollup-plugin-commonjs
            main: true,  // Default: true

            // if there's something your bundle requires that you DON'T
            // want to include, add it to 'skip'. Local and relative imports
            // can be skipped by giving the full filepath. E.g.,
            // `path.resolve('src/relative-dependency.js')`
            skip: [],

            // some package.json files have a `browser` field which
            // specifies alternative files to load for people bundling
            // for the browser. If that's you, use this option, otherwise
            // pkg.browser will be ignored
            browser: true,  // Default: false

            // not all files you want to resolve are .js files
            extensions: [ '.js', '.json' ],  // Default: ['.js']

            // whether to prefer built-in modules (e.g. `fs`, `path`) or
            // local ones with the same names
            preferBuiltins: false  // Default: true

          }),
          includePaths({
            include: {},
            paths: ['./src/', 'dist'],
            external: [],
            extensions: ['.js', '.json', '.html']
          }),
          commonjs({
            // non-CommonJS modules will be ignored, but you can also
            // specifically include/exclude files
            //include: 'node_modules/**',  // Default: undefined
            exclude: [ 'node_modules/@angular/**/esm/**', 'node_modules/@angular/core/esm/index.js' ],  // Default: undefined

            // search for files other than .js files (must already
            // be transpiled by a previous plugin!)
           // extensions: ['.js', '.json'],  // Default: [ '.js' ]

            //// if true then uses of `global` won't be dealt with by this plugin
            //ignoreGlobal: false,  // Default: false

            // if false then skip sourceMap generation for CommonJS modules
            sourceMap: false,  // Default: true

            // explicitly specify unresolvable named exports
            // (see below for more details)
            namedExports: { 'node_modules/@angular/core/esm/index.js': ['default'] }  // Default: undefined
          })
        ],
        entry: 'dist/main.js',
        allowRealFiles: true,
        format: 'iife',
      },
      babel({
        "presets": [ "es2015-rollup" ]
      })
    ))
    .pipe(gulp.dest('dist'));
});


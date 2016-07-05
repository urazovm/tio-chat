'use strict';

const ts = require('gulp-typescript');
const gulp = require('gulp');

const tscConfig = require('./tsconfig.json');
const rollup = require('gulp-rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const includePaths = require('rollup-plugin-includepaths');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
var inlineNg2Template = require('gulp-inline-ng2-template');
var htmlMinifier= require('html-minifier');

class RollupNG2 {
  constructor(options){
    this.options = options;
  }
  resolveId(id, from){
    if(id.startsWith('rxjs/')){
      return `${__dirname}/node_modules/rxjs-es/${id.replace('rxjs/', '')}.js`;
    }
  }
  /*
  resolveId(id, from){
    //console.log(`${from} => ${id}`)
    if(id.startsWith('rxjs/')){
      return `${__dirname}/node_modules/rxjs-es/${id.split('rxjs/').pop()}.js`;
    }

    //TODO: remove when https://github.com/angular/angular/issues/8381 lands
    if(id.startsWith('@angular/core')){
      if(id === '@angular/core'){
        return `${__dirname}/node_modules/@angular/core/esm/index.js`;
      }
      return `${__dirname}/node_modules/@angular/core/esm/${id.split('@angular/core').pop()}.js`;
    }
    if(id.startsWith('@angular/common')){
      if(id === '@angular/common'){
        return `${__dirname}/node_modules/@angular/common/esm/index.js`;
      }
      return `${__dirname}/node_modules/@angular/common/esm/${id.split('@angular/common').pop()}.js`;
    }
  }*/
}
const rollupNG2 = (config) => new RollupNG2(config);

function minifyTemplate(ext, file) {
  return htmlMinifier.minify(file, {
    collapseWhitespace: true,
    caseSensitive: true,
    removeComments: true,
    removeRedundantAttributes: true
  });
}

gulp.task('js-with-rollup', ()=>{
  return gulp.src(['src/**/*.ts','!src/**/*.spec.ts'])
    .pipe(inlineNg2Template({useRelativePaths: true, templateProcessor: minifyTemplate}))
    .pipe(ts(tscConfig.compilerOptions))
    .pipe(gulp.dest('dist')) //wip - this shouldn't be here - but it's nice to see the files for debug purposes atm though
    .pipe(rollup(
      {
        plugins: [
          rollupNG2(),
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
            skip: ['node_modules/@angular2-material/toolbar/toolbar.js', 'node_modules/angular2-jwt/angular2-jwt.js'],

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
            include: 'node_modules/**',  // Default: undefined
            exclude: [ 'node_modules/angular2-jwt/angular2-jwt.js', 'node_modules/rxjs-es/**', 'node_modules/@angular/**/esm/**', 'node_modules/@angular2-material/**' ],  // Default: undefined

            // search for files other than .js files (must already
            // be transpiled by a previous plugin!)
           // extensions: ['.js', '.json'],  // Default: [ '.js' ]

            //// if true then uses of `global` won't be dealt with by this plugin
            //ignoreGlobal: false,  // Default: false

            // if false then skip sourceMap generation for CommonJS modules
            sourceMap: false,  // Default: true

            // explicitly specify unresolvable named exports
            // (see below for more details)
            //namedExports: { 'node_modules/@angular/core/esm/index.js': ['default'] }  // Default: undefined
          })
        ],
        entry: 'dist/main.js',
        allowRealFiles: true,
        external: [ 'node_modules/@angular2-material/toolbar/toolbar.js',
        'node_modules/angular2-jwt/angular2-jwt.js'],
        globals: {
          'angular2-jwt/angular2-jwt': 'vendor._angular2_jwt'
        }
      }
    ))
    .pipe(gulp.dest('dist'));
});

gulp.task('js-deps', ()=>{
  return gulp.src(['src/vendor.ts'])
    .pipe(ts(tscConfig.compilerOptions))
    .pipe(gulp.dest('dist'))
    .pipe(rollup(
      {
        plugins: [
          rollupNG2(),
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
            skip: ['node_modules/symbol-observable/index.js'],

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
            include: 'node_modules/**',  // Default: undefined
            exclude: [ 'node_modules/rxjs-es/**', 'node_modules/@angular/**/esm/**' ],  // Default: undefined

            // search for files other than .js files (must already
            // be transpiled by a previous plugin!)
            // extensions: ['.js', '.json'],  // Default: [ '.js' ]

            //// if true then uses of `global` won't be dealt with by this plugin
            //ignoreGlobal: false,  // Default: false

            // if false then skip sourceMap generation for CommonJS modules
            sourceMap: false,  // Default: true

            // explicitly specify unresolvable named exports
            // (see below for more details)
            //namedExports: { 'node_modules/@angular/core/esm/index.js': ['default'] }  // Default: undefined
          })
        ],
        entry: 'dist/vendor.js',
        allowRealFiles: true,
      }
    ))
    .pipe(gulp.dest('dist'));
});


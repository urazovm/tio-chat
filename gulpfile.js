var ts = require('gulp-typescript');
var gulp = require('gulp');
var printFilenames = require( 'gulp-print' );
var inlineNg2Template = require('gulp-inline-ng2-template');
var htmlMinifier= require('html-minifier');
var uglify = require('gulp-uglify');
var concat = require( 'gulp-concat' );
var through = require('through2');
var Builder = require('systemjs-builder');
var runSequence = require('run-sequence');

var globs = {
  deps: [
    'node_modules/core-js/client/shim.min.js',
    'node_modules/systemjs/dist/system-polyfill.js',
    'node_modules/systemjs/dist/system.js',
    'node_modules/rxjs/bundles/Rx.js',
    'node_modules/zone.js/dist/zone.js',
    'node_modules/reflect-metadata/Reflect.js',
    'node_modules/lodash/lodash.min.js',
  ],
  angular: [
    'node_modules/@angular/**',
  ],
  systemjs: [
    'node_modules/systemjs/dist/*.js',
  ],
  'angularMaterials': [
    'node_modules/@angular2-material/**'
  ],
  angular2Jwt: [
    'node_modules/angular2-jwt/**'
  ],
  rxJs: [
    'node_modules/rxjs/**'
  ],
  main: [

  ],
  html: [
    'index.html'
  ],
  assets: [
    'assets/**'
  ],
  codeMirror: [
    'node_modules/codemirror/**/*.js', 'node_modules/codemirror/**/*.css'
  ]
};

function minifyTemplate(ext, file) {
  return htmlMinifier.minify(file, {
    collapseWhitespace: true,
    caseSensitive: true,
    removeComments: true,
    removeRedundantAttributes: true
  });
}

var tsProject = ts.createProject('tsconfig.json');

gulp.task('js', function() {
  return gulp.src(['src/**/*.ts','!src/**/*.spec.ts'])
    .pipe(printFilenames())
    .pipe(inlineNg2Template({useRelativePaths: true, templateProcessor: minifyTemplate}))
    .pipe(ts(tsProject))
    .pipe(gulp.dest('tmp'));
});

gulp.task('js-node', function() {

  gulp.src('./src/system-config.js')
    .pipe(gulp.dest('tmp'));

  gulp.src(globs.angularMaterials)
    //.pipe(gulp.dest('tmp/node_modules/@angular2-material'))
    .pipe(gulp.dest('dist/node_modules/@angular2-material'));

  gulp.src(globs.codeMirror)
    .pipe(gulp.dest('dist/node_modules/codemirror'));

  gulp.src(globs.rxJs)
    //.pipe(gulp.dest('tmp/node_modules/rxjs'))
    .pipe(gulp.dest('dist/node_modules/rxjs'));

  gulp.src(globs.systemjs)
    .pipe(gulp.dest('dist/node_modules/systemjs/dist'));

  gulp.src(globs.angular2Jwt)
    //.pipe(gulp.dest('tmp/node_modules/angualr2-jwt'))
    .pipe(gulp.dest('dist/node_modules/angular2-jwt'));


  gulp.src(globs.assets)
    //.pipe(gulp.dest('tmp/assets'))
    .pipe(gulp.dest('dist/assets'));

  return gulp.src(globs.angular)
    //.pipe(gulp.dest('tmp/node_modules/@angular'))
    .pipe(gulp.dest('dist/node_modules/@angular'));
});

gulp.task('js-deps', function() {
  gulp.src(globs.deps)
    .pipe(printFilenames())
    .pipe(concat('deps.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
/*
  gulp.src(globs.angular)
    .pipe(concat('deps-angular.js'))
    .pipe(gulp.dest('dist'));*/
});

gulp.task('html', function() {
  return gulp.src(['src/index.html', 'src/system-config.js'])
    .pipe(gulp.dest('dist'));
});

gulp.task('system', function(cb) {
  var builder = new Builder('./tmp', './tmp/system-config.js');
  builder.buildStatic('./tmp/app.js', "dist/app.min.js", {sourceMaps: false, minify: false, sfx: true})
    .then(function () {
      console.log('here');
      cb();
    })
    .catch(function(err) {
      console.log(err);
      cb(err);
    });
});

gulp.task('sys', function(cb) {
  var builder = new Builder();
  builder.loadConfig('./tmp/system-config.js')
    .then( function() {
      builder.buildStatic('./tmp/app.js', "dist/app.min.js", {sourceMaps: false, minify: true})
        .then(function () {

        })
        .catch(function(err) {
          console.log(err);
          cb(err);
        });
    });
});

gulp.task('build', function(cb) {
  runSequence(['js','js-node','js-deps','html'], 'system', cb);
})

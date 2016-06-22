/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
var map = {
    '@angular2-material': 'node_modules/@angular2-material',
    'angular2-jwt': 'node_modules/angular2-jwt',
    '@angular': 'node_modules/@angular'
};
/** User packages configuration. */
var packages = {
    '@angular2-material/core': {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'core.js'
    },
    '@angular2-material/checkbox': {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'checkbox.js'
    },
    '@angular2-material/button': {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'button.js'
    },
    '@angular2-material/card': {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'card.js'
    },
    '@angular2-material/icon': {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'icon.js'
    },
    '@angular2-material/input': {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'input.js'
    },
    '@angular2-material/list': {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'list.js'
    },
    '@angular2-material/progress-bar': {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'progress-bar.js'
    },
    '@angular2-material/progress-circle': {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'progress-circle.js'
    },
    '@angular2-material/radio': {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'radio.js'
    },
    '@angular2-material/sidenav': {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'sidenav.js'
    },
    '@angular2-material/toolbar': {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'toolbar.js'
    },
    '@angular2-material/tabs': {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'tabs.js'
    },
    '@angular2-material/slide-toggle': {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'slide-toggle.js'
    },
    '@angular2-material/grid-list': {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'grid-list.js'
    },
    'angular2-jwt': {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'angular2-jwt.js'
    },
    '@angular/platform-browser-dynamic': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'index.js'
    }
};
////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
var barrels = [
    // Angular specific barrels.
    '@angular/core',
    '@angular/common',
    '@angular/compiler',
    '@angular/http',
    '@angular/router',
    '@angular/platform-browser',
    // Thirdparty barrels.
    'rxjs',
    // App specific barrels.
    'app',
    'app/shared',
    'app/+chat',
    'app/+authenticated',
    'app/+login',
];
var cliSystemConfigPackages = {};
barrels.forEach(function (barrelName) {
    cliSystemConfigPackages[barrelName] = { format: 'cjs', main: 'index.js' };
});
// Apply the CLI SystemJS configuration.
System.config({
  "transpiler": "babel",
  "babelOptions": {
    "sourceMaps": false
  },
  map: {
      '@angular': 'node_modules/@angular',
      'rxjs': 'node_modules/rxjs'
  },
  packages: cliSystemConfigPackages
});
// Apply the user's configuration.
System.config({ map: map, packages: packages });

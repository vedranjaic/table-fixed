// Gulp & plugins
var gulp = require('gulp'),
	rename = require('gulp-rename'),
	browserSync = require('browser-sync').create(),
	sass = require('gulp-ruby-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	fileinclude = require("gulp-file-include");

// Sources
var src = {
	scripts: ["src/js/jquery.js", "src/js/modernizr.js", "src/js/app.js"],
	modules: 'src/modules/**/*.html',
	images: 'src/images/*.{gif,jpg,png,svg,ico}',
	html: 'src/*.tpl.html',
	sass: 'src/sass/',
	scss: 'src/sass/**/*.scss',
	js: 'src/js/**/*.js',
	// Vendors
	bootstrapjs: 'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
	bootstrap: 'bower_components/bootstrap-sass/assets/stylesheets/_bootstrap.scss',
	modernizr: 'bower_components/modernizr/modernizr.js',
	jquery: 'bower_components/jquery/dist/jquery.js'
}

// Builds
var build = {
	scripts: ["build/assets/js/**/*.js"],
	images: 'build/assets/images',
	dest: 'build/',
	html: 'build/**/*.html',
	css: 'build/',
	js: 'build/assets/js',
	// Vendors
	vendors: 'build/assets/js/vendors/',
}



// TASKS
// Static server & watcher
gulp.task('server', ['sass'], function() {

	browserSync.init({
        server: build.dest,
        open: false
    });

	// Watch for SCSS
	gulp.watch(src.scss, ['sass']);
	// Watch for HTML Template files
	gulp.watch(src.html, ['fileinclude']);
	gulp.watch(build.html).on('change', browserSync.reload);
	// Watch for HTML modules
	gulp.watch(src.modules, browserSync.reload);
	// Watch for JS
	gulp.watch(src.js, ['scripts-js']);
	gulp.watch(build.scripts, browserSync.reload);

});

// SASS
gulp.task('sass', function () {

	return sass(src.scss, {
			style: 'expanded',
			sourcemap: true
		})
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe(sourcemaps.write('/', {
			includeContent: false,
			sourceRoot: '/'
		}))
		.pipe(gulp.dest(build.css))
		.pipe(browserSync.stream({match: '**/*.css'}));
});

// Fileinclude
gulp.task('fileinclude', function() {
	
	return gulp.src([src.html])
		.pipe(fileinclude({
			indent: true
		}))
		.pipe(rename({
			extname: ""
		}))
		.pipe(rename({
			extname: ".html"
		}))
		.pipe(gulp.dest(build.dest));

});

// Init main script and vendors
gulp.task('scripts-js', function() {

	// Init main app.js
	return gulp.src([src.js])
		.pipe(gulp.dest(build.js));

});
gulp.task('scripts-vendors', function() {

	// Init vendors
	return gulp.src([src.bootstrapjs, src.modernizr])
		.pipe(gulp.dest(build.vendors));

});


// Default
gulp.task('default', ['sass', 'server', 'scripts-js']);

// Init project
gulp.task('init', ['scripts-js', 'scripts-vendors']);

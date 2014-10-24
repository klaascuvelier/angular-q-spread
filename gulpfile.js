'use strict';

var gulp    = require('gulp'),
    karma   = require('karma').server,
    jshint  = require('gulp-jshint'),
    rename  = require('gulp-rename'),
    uglify  = require('gulp-uglify'),
    stylish = require('jshint-stylish'),

    config = {
        test: __dirname + '/test/karma.conf.js',
        src: './src/q-spread.js',
        dist: './dist/'
    };


// Run karma unit tests
gulp.task('karma', function (done) {
    karma.start({
        configFile: config.test,
        singleRun: true
    }, done);
});

// JSHint the source files
gulp.task('jshint', function () {
    return gulp.src(config.src)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// Copy src to dist
gulp.task('build-regular', ['test'], function () {
    return gulp
        .src(config.src)
        .pipe(gulp.dest(config.dist));
});

// Copy minified src to dist
gulp.task('build-minified', ['test'], function () {
    return gulp
        .src(config.src)
        .pipe(uglify())
        .pipe(rename('q-spread.min.js'))
        .pipe(gulp.dest(config.dist));
});

// Run tests
gulp.task('test', ['jshint', 'karma']);

// Build
gulp.task('build', ['test', 'build-regular', 'build-minified']);

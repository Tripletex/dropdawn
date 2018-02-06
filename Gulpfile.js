'use strict';

const gulp = require('gulp')
const babel = require('gulp-babel')
const eslint = require('gulp-eslint')
const sass = require('gulp-sass')
const sassLint = require('gulp-sass-lint')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const umd = require('gulp-umd');
const autoprefixer = require('gulp-autoprefixer')
const runSequence = require('run-sequence')
const rename = require('gulp-rename')

const conf = require('./package.json')

let DEVMODE = false

function fatalError(error) {
	process.stderr.write(error.message + '\n')
	process.exit(1)
}

gulp.task('scss-lint', function() {
	if(DEVMODE === true) return;
	//gulp.src('sass/**/*.s+(a|c)ss')
	return gulp.src(['src/*.scss'])
		.pipe(sassLint(
			{
				configFile: './scss-lint.yml'
			}
		))
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError())
})

gulp.task('js-lint', function () {
	if(DEVMODE === true) return;
	return gulp.src(['src/FabBar.jsx'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
})

gulp.task('sass', function(cb) {
	return gulp.src('src/index.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: DEVMODE ? 'expanded' : 'compressed'})
			.on('error', fatalError))
		.pipe(autoprefixer({
			// See https://github.com/ai/browserslist#queries for what these queries means.
			browsers: [
				'last 2 versions',
				'last 2 Android versions',
				'last 2 ChromeAndroid versions',
				'last 2 FirefoxAndroid versions']
		}))
    .pipe(rename(function(path) {
      path.basename = conf.name + '-' + conf.version
    }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist/'))
})

gulp.task('react', function(cb) {
  let tmp = gulp.src('src/index.jsx')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(umd({
      exports: function (file) {
        return 'Dropdawn';
      },
        namespace: function(file) {
          return 'Dropdawn';
        }
    }));

  if(!DEVMODE) {
    tmp = tmp.pipe(uglify())
  }
  return tmp.pipe(rename(function(path) {
      path.basename = conf.name + '-' + conf.version
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'))
})


gulp.task('dev-build', function(cb) {
  DEVMODE = true
  runSequence(['build'], cb)
})

gulp.task('build', function(cb) {
  runSequence(
		['scss-lint', 'js-lint'],
		['sass', 'react'],
		cb);
})

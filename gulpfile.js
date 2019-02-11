var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');
var connect = require('gulp-connect');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var argv = require('yargs').argv;
var rename = require('gulp-rename');
var removeCode = require('gulp-remove-code');
var fs = require('fs');
var prod = false,
    dev = true;

gulp.task('clean', function () {
    return del(['./dist']);
});

gulp.task('connect', function () {
    connect.server({
        root: "./dist/",
        port: 4006,
        livereload: true,
//        https: {
//            key: fs.readFileSync('./src/ssl/'),
//            cert: fs.readFileSync('./src/ssl/'),
//
//        }
    });
});

gulp.task('scripts', function () {
    gulp.src(['./src/**/*.json', './src/*.js', './src/**/*.js', '!./src/lib/**/*.js', './src/airspaceFiles/**/*'], {
        base: "./src/"
    }).pipe(removeCode({
        prod: prod,
        dev: dev
    })).pipe(gulp.dest("./dist/")).pipe(connect.reload());

    gulp.src(['./src/faqFiles/**/*', './src/ViewerJS/**/*'], {
        base: './src/'
    }).pipe(gulp.dest('./dist/')).pipe(connect.reload());

    // gulp.src(['./src/config.js', '!./src/components/assets/*.js',"./src/components/**!(assets)/*.js", './src/components/assets/**/*.js']).pipe(concat('helpers.js')).pipe(gulp.dest('./dist/components/assets/')).pipe(connect.reload());
});

gulp.task('html', function () {
    gulp.src('./src/**/*.html', {
        base: "./src/"
    }).pipe(gulp.dest("./dist/")).pipe(connect.reload());
});

gulp.task('stylesheets', function () {
    gulp.src("./src/stylesheets/**/*.scss", {
        base: "./src/"
    }).pipe(sass()).pipe(gulp.dest("./dist/")).pipe(connect.reload());
    gulp.src("./src/lib/materialize/sass/materialize.scss", {
        base: "./src/lib/materialize/sass/"
    }).pipe(sass()).pipe(gulp.dest("./src/lib/materialize/css/")).pipe(connect.reload());
    gulp.src('./src/stylesheets/**/*.css').pipe(rename({
        dirname: ''
    })).pipe(gulp.dest("./dist/stylesheets/"));
});

gulp.task('lib', function () {
    gulp.src([
		'./src/lib/jquery-3.2.0.min.js',
		'./src/lib/leaflet/leaflet.js',
		'./src/lib/**/!(jquery-3.2.0.min,vue.min,leaflet)*.js']).pipe(concat("libsConcat.js")).pipe(gulp.dest("./dist/lib/")).pipe(connect.reload());

    gulp.src('./src/lib/**/*.*.map').pipe(rename({
        dirname: ''
    })).pipe(gulp.dest("./dist/lib/"));
    gulp.src('./src/lib/**/*.{ttf,eot,woff,woff2,otf}').pipe(rename({
        dirname: ''
    })).pipe(gulp.dest("./dist/lib/fonts/"));
    gulp.src(['!./src/lib/bootstrap/**',
              './src/lib/**/!(bootstrap.min,bootstrap-theme.min)*.css']).pipe(concat("libsConcatCSS.css")).pipe(gulp.dest("./dist/lib/css/"));
    gulp.src('./src/lib/**/*.{png,jpg,jpeg,gif}').pipe(rename({
        dirname: ''
    })).pipe(gulp.dest('./dist/lib/images'));
    gulp.src(['./src/lib/vue.min.js']).pipe(concat("libsConcat.js")).pipe(gulp.dest("./dist/lib/")).pipe(connect.reload());
    gulp.src(['./node_modules/js-search/dist/**']).pipe(gulp.dest('./dist/lib/'));
    gulp.src(['./src/lib/bootstrap/**']).pipe(gulp.dest('./dist/lib/css/bootstrap/'));

});

gulp.task('img', function () {
    gulp.src("./src/img/**/*.{png,jpg,jpeg,gif,svg}", {
        base: "./src/"
    }).pipe(gulp.dest("./dist/")).pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./src/config.js', "./src/components/**/*.js"], ['scripts']);
    gulp.watch("./src/**/*.html", ['html']);
    gulp.watch("./src/stylesheets/**/*.scss", ['stylesheets']);
    gulp.watch("./src/lib/materialize/sass/**/*.scss", ['stylesheets']);
});

gulp.task('build', function () {
    if (argv.prod) {
        prod = true;
        dev = false;
    }
    runSequence('clean','stylesheets',['scripts', 'lib', 'html', 'img', 'connect', 'watch']);
});

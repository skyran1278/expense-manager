'use strict';
// 引入欲使用的套件模組
import gulp from 'gulp';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import connect from 'gulp-connect';
import browserify from 'browserify';
import babelify from 'babelify';
// 轉成 gulp 讀取的 vinyl（黑膠）流
import source from 'vinyl-source-stream'; // 將常規流轉換為包含 Stream 的 vinyl 對象
import buffer from 'vinyl-buffer'; // 將 vinyl 對象內容中的 Stream 轉換為 Buffer
import sourcemaps from 'gulp-sourcemaps';
import gutil from 'gulp-util';
import image from 'gulp-image';
import htmlmin from 'gulp-htmlmin';
import cleanCSS from 'gulp-clean-css';
import del from 'del';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import through2 from 'through2';
import through from 'through';
import watchify from 'watchify';
import assign from 'lodash.assign';
// var assign = require('lodash.assign');
// gulpNotify = require("gulp-notify");
// gulpPlumber = require('gulp-plumber');


//--------------------------------------------讀取檔案路徑
const dirs = {
    src: 'src',
    dest: 'dist'
};

const stylesPaths = {
    src: `${dirs.src}/styles/*.scss`,
    dest: `${dirs.dest}/css`
};

const rootPaths = {
    src: `${dirs.src}/*.{json,html}`,
    dest: `${dirs.dest}`
};

const scriptsPaths = {
    src: `${dirs.src}/scripts/*.js`,
    dest: `${dirs.dest}/js`
};

const imagesPaths = {
    src: `${dirs.src}/images/*`,
    dest: `${dirs.dest}/img`
};


//--------------------------------------------清理目標文件
gulp.task('cleanStyles', function() {
    return del([`${stylesPaths.dest}/*`]);
});

gulp.task('cleanScripts', function() {
    return del([`${scriptsPaths.dest}/*`]);
});

gulp.task('cleanImages', function() {
    return del([`${imagesPaths.dest}/*`]);
});

gulp.task('cleanHtml', function() {
    return del([`${rootPaths.dest}/*.html`]);
});

gulp.task('cleanJson', function() {
    return del([`${rootPaths.dest}/*.json`]);
});
//--------------------------------------------執行任務
// gulp.src("../test/fixtures/*")
//     .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
//     .pipe(through(function() {
//         this.emit("error", new Error("Something happend: Error message!"))
//     }));
// 編譯 Scss 任務，完成後送到 dist/css/main.css
gulp.task('styles', ['cleanStyles'], () => {
    return gulp.src(stylesPaths.src)
        .pipe(plumber({ errorHandler: notify.onError("\n\n" + gutil.colors.bgRed.white("\n" + "Error:" + "\n\n" + "<%= error.message %>") + "\n\n") }))
        // .pipe(through(function() {
        //     this.emit("error", new Error("Something happend: Error message!"))
        // }))
        // .pipe(plumber())
        .pipe(sass()) // 編譯 Scss .on('error', sass.logError) //已經有通知，可以不需要
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(cleanCSS({ debug: true }, function(details) {
            console.log(`css-originalSize: ${(details.stats.originalSize/1024).toFixed(2)} KB`); //details.name
            console.log(`css-minifiedSize: ${(details.stats.minifiedSize/1024).toFixed(2)} KB`); //details.name
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(stylesPaths.dest))
        .pipe(connect.reload());
});

// add custom browserify options here
// var b = watchify(browserify(assign({}, watchify.args, {
//     cache: {}, // required for watchify
//     packageCache: {}, // required for watchify
//     entries: ['./src/scripts/main.js']
// })));

// // add transformations here
// // i.e. b.transform(coffeeify);

// b.transform(babelify);

// 編譯 JavaScript 轉譯、合併、壓縮任務，完成後送到 dist/js/bundle.js
gulp.task('scripts', ['cleanScripts'], () => {
    // return gulp.src(scriptsPaths.src)
    //     .pipe(plumber())
    //     .pipe(through2.obj(function(file, enc, next) {
    //         browserify(file.path)
    //             // .transform(reactify)
    //             .transform(babelify) // 轉譯
    //             .bundle(function(err, res) {
    //                 err && console.log(err.stack);
    //                 file.contents = res;
    //                 next(null, file);
    //             });
    //     }))
    // return b.bundle()
    //     // log errors if they happen
    //     .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    //     .pipe(source('bundle.js')) // gives streaming vinyl file object
    //     .pipe(buffer()) // 從 streaming 轉回 buffered vinyl 檔案 <----- convert from streaming to buffered vinyl file object
    return browserify({
            entries: ['./src/scripts/main.js'],
            debug: true
        })
        .transform(babelify) // 轉譯
        .bundle()
        .on('error', function(err) {
            // console.log(err.toString()); console.error.bind
            // console.log(err.message);
            // notify('Error: ' + err.message); 無法出現
            // gutil.log(gutil.colors.red("Browserify compile error:") + err.message + "\n\t" + gutil.colors.cyan("in file"));
            gutil.log("\n\n" + gutil.colors.bgRed("\n" + 'Browserify compile error: ' + "\n\n" + err.message + "\n") + "\n\n");
            // notify("JS Error");
            // gutil.beep();
            this.emit("end");
        })
        // .on("error", function(err) {
        //         gutil.log(
        //             gutil.colors.red("Browserify compile error:"), 
        //             err.message, 
        //             "\n\t", 
        //             gutil.colors.cyan("in file"), 
        //             file.path
        //         )
        //     })
        // .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
        // .pipe(through2(function() {
        //     this.emit("error", new Error("Something happend: Error message!"))
        // }))
        .pipe(source('bundle.js')) // gives streaming vinyl file object
        .pipe(buffer()) // 從 streaming 轉回 buffered vinyl 檔案 <----- convert from streaming to buffered vinyl file object
        // .pipe(plumber())
        .pipe(plumber({ errorHandler: notify.onError("\n\n" + gutil.colors.bgRed.white("\n" + "Error:" + "\n\n" + "<%= error.message %>") + "\n\n") }))
        .pipe(sourcemaps.init({ loadMaps: true })) // 由於我們壓縮了檔案，要用 sourcemaps 來對應原始文件方便除錯
        .pipe(uglify()) // 壓縮檔案 now gulp-uglify works
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(scriptsPaths.dest))
        .pipe(notify("Finish JS"))
        .pipe(connect.reload());
});

// 複製 images 任務，完成後送到 dist/images
gulp.task('images', ['cleanImages'], () => {
    return gulp.src(imagesPaths.src)
        //.pipe(image())    
        .pipe(gulp.dest(imagesPaths.dest))
        .pipe(connect.reload());
});

// 複製 html 任務，完成後送到 dist
gulp.task('html', ['cleanHtml'], () => {
    return gulp.src(rootPaths.src)
        //.pipe(htmlmin({collapseWhitespace: true})) 
        .pipe(gulp.dest(rootPaths.dest))
        .pipe(connect.reload());
});

gulp.task('json', ['cleanJson'], () => {
    return gulp.src(rootPaths.src)
        .pipe(gulp.dest(rootPaths.dest))
        .pipe(connect.reload());
});

// 啟動測試用 server
gulp.task('server', () => {
    connect.server({
        root: ['./dist'],
        livereload: true,
        port: 7777,
    });
});

// 監聽是否有檔案更新
gulp.task('watch', () => {
    gulp.watch(stylesPaths.src, ['styles']);
    gulp.watch(scriptsPaths.src, ['scripts']);
    gulp.watch(imagesPaths.src, ['images']);
    gulp.watch(rootPaths.src, ['html']);
    gulp.watch(rootPaths.src, ['json']);
});

// 兩種任務類型，第一種會啟動 server
gulp.task('default', ['html', 'scripts', 'styles', 'images', 'json', 'server', 'watch']);
gulp.task('build', ['html', 'scripts', 'styles', 'images', 'json']);

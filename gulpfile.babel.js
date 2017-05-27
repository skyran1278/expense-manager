'use strict';

import gulp from 'gulp';
import del from 'del';

// 轉譯
import babelify from 'babelify';
import sass from 'gulp-sass';

// 壓縮
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import cleanCSS from 'gulp-clean-css';
import htmlmin from 'gulp-htmlmin';

// 轉成 gulp 讀取的 vinyl（黑膠）流
// 將常規流轉換為包含 Stream 的 vinyl 對象
// 將 vinyl 對象內容中的 Stream 轉換為 Buffer
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

// 打包合併文件 JS 與 HTML
import browserify from 'browserify';
import watchify from 'watchify';
import assign from 'lodash.assign';
import fileinclude from 'gulp-file-include';

// Debug 用
import sourcemaps from 'gulp-sourcemaps';

// LiveReload
const browserSync = require('browser-sync').create();

// 錯誤處理
// cmd log
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';



//--------------------------------------------讀取檔案路徑

const stylesPaths = {
    src: `src/styles/*.scss`,
    dist: `docs/css`,
};

const htmlPaths = {
    src: `src/*.html`,
    dist: `docs`,
};

const scriptsPaths = {
    src: `src/scripts/*.js`,
    dist: `docs/js`,
};

const imagesPaths = {
    src: `src/images/*`,
    dist: `docs/img`,
};



//--------------------------------------------清理目標文件

gulp.task('cleanStyles', () => {
    return del(`${stylesPaths.dist}/*`);
});

gulp.task('cleanScripts', () => {
    return del(`${scriptsPaths.dist}/*`);
});

gulp.task('cleanImages', () => {
    return del(`${imagesPaths.dist}/*`);
});

gulp.task('cleanHtml', () => {
    return del(`${htmlPaths.dist}/*.html`);
});



//--------------------------------------------執行任務

// 編譯 Scss 任務，完成後送到 dist/css/main.css
gulp.task('styles', ['cleanStyles'], () => {
    return gulp.src(stylesPaths.src)
        .pipe(plumber({ errorHandler: notify.onError("\n\n" + gutil.colors.bgRed.white("\n" + "Error:" + "\n\n" + "<%= error.message %>") + "\n\n") }))
        .pipe(sass()) // 編譯 Scss
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(cleanCSS({ debug: true }, function(details) {
            console.log(`css-originalSize: ${(details.stats.originalSize/1024).toFixed(2)} KB`);
            console.log(`css-minifiedSize: ${(details.stats.minifiedSize/1024).toFixed(2)} KB`);
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(stylesPaths.dist))
        // .pipe(connect.reload())
        .pipe(browserSync.stream());
});


// 編譯 JavaScript 轉譯、合併、壓縮任務，完成後送到 dist/js/bundle.js

// add custom browserify options here
var customOpts = {
  entries: ['./src/scripts/main.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

// add transformations here
b.transform(babelify);

// so you can run `gulp js` to build the file
gulp.task('scripts', ['cleanScripts'], () => {
    return b.bundle()
        .on('error', function(err) {
            gutil.log("\n\n" + gutil.colors.bgRed("\n" + 'Browserify compile error: ' + "\n\n" + err.message + "\n") + "\n\n");
            this.emit("end");
        })
        .pipe(source('bundle.js')) // gives streaming vinyl file object
        .pipe(buffer()) // 從 streaming 轉回 buffered vinyl 檔案 <----- convert from streaming to buffered vinyl file object
        .pipe(plumber({ errorHandler: notify.onError("\n\n" + gutil.colors.bgRed.white("\n" + "Error:" + "\n\n" + "<%= error.message %>") + "\n\n") }))
        .pipe(sourcemaps.init({ loadMaps: true })) // 由於我們壓縮了檔案，要用 sourcemaps 來對應原始文件方便除錯
        .pipe(uglify()) // 壓縮檔案 now gulp-uglify works
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(scriptsPaths.dist))
        // .pipe(connect.reload())
        // .pipe(notify("Finish JS"))
        .pipe(browserSync.stream());
});


// 複製 images 任務，完成後送到 dist/images
gulp.task('images', ['cleanImages'], () => {
    return gulp.src(imagesPaths.src)
        .pipe(imagemin())
        .pipe(gulp.dest(imagesPaths.dist))
        // .pipe(connect.reload())
        .pipe(browserSync.stream());
});

// 合併 html 與 複製 JSON，完成後送到 dist
gulp.task('html', ['cleanHtml'], () => {
    return gulp.src(htmlPaths.src)
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./docs'))
        .pipe(browserSync.stream());
});

// add json task, not normal
gulp.task('json', () => {
    return gulp.src('src/*.json')
        .pipe(gulp.dest('./docs'))
        .pipe(browserSync.stream());
});

//--------------------------------------------任務宣告完成

// 啟動測試用 server
gulp.task('server', () => {
    browserSync.init({
        server: "./docs",
    });
});

// 監聽是否有檔案更新
// add json
gulp.task('watch', () => {
    gulp.watch(stylesPaths.src, ['styles']);
    gulp.watch(scriptsPaths.src, ['scripts']);
    gulp.watch(imagesPaths.src, ['images']);
    gulp.watch([htmlPaths.src, `src/templates/*.html`], ['html']);
    gulp.watch('src/*.json', ['json']);
});

// 兩種任務類型，第一種會啟動 server
// add json
gulp.task('default', ['server', 'html', 'scripts', 'styles', 'images', 'watch', 'json']);
gulp.task('build', ['html', 'scripts', 'styles', 'images', 'json']);

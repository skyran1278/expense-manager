'use strict';
// 引入欲使用的套件模組
import gulp from 'gulp';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import connect from 'gulp-connect';
import browserify from 'browserify';
import babelify from 'babelify';
// 轉成 gulp 讀取的 vinyl（黑膠）流
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import gutil from 'gulp-util';
import image from 'gulp-image';
import htmlmin from 'gulp-htmlmin';
import cleanCSS from 'gulp-clean-css';
import del from 'del';


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
gulp.task('cleanStyles', function () {
  return del([`${stylesPaths.dest}/*`]);
});

gulp.task('cleanScripts', function () {
  return del([`${scriptsPaths.dest}/*`]);
});

gulp.task('cleanImages', function () {
  return del([`${imagesPaths.dest}/*`]);
});

gulp.task('cleanHtml', function () {
  return del([`${rootPaths.dest}/*.html`]);
});

gulp.task('cleanJson', function () {
  return del([`${rootPaths.dest}/*.json`]);
});
//--------------------------------------------執行任務

// 編譯 Scss 任務，完成後送到 dist/css/main.css
gulp.task('styles', ['cleanStyles'], () => {
  return gulp.src(stylesPaths.src)
    .pipe(sass().on('error', sass.logError)) // 編譯 Scss
    .pipe(sourcemaps.init({loadMaps: true}))      
      .pipe(cleanCSS({debug: true}, function(details) {
        console.log(`css-originalSize: ${(details.stats.originalSize/1024).toFixed(2)} KB`); //details.name
        console.log(`css-minifiedSize: ${(details.stats.minifiedSize/1024).toFixed(2)} KB`); //details.name
      }))      
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(stylesPaths.dest))  
    .pipe(connect.reload());
});

// 編譯 JavaScript 轉譯、合併、壓縮任務，完成後送到 dist/js/bundle.js
gulp.task('scripts', ['cleanScripts'], () => {
  return browserify({
        entries: ['./src/scripts/main.js']
    })
    .transform(babelify) // 轉譯
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer()) // 從 streaming 轉回 buffered vinyl 檔案
    .pipe(sourcemaps.init({loadMaps: true})) // 由於我們壓縮了檔案，要用 sourcemaps 來對應原始文件方便除錯
      .pipe(uglify()) // 壓縮檔案
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./')) 
    .pipe(gulp.dest(scriptsPaths.dest))
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

title: 在Gulp中使用BrowserSync
date: 2016-02-24 19:58:51
categories: "自动化构建工具"
tags: ["Gulp", "BrowserSync"]
---

很早就听说过BrowserSync，也看过一些相关文章，可就是没用过。之前一直在用Gulp开发项目，每次编写完Sass后还要用按`F5`刷新页面看效果，想想也是够傻的，这么好用的东西竟然现在才开始用。

BrowserSync可以同时同步刷新多个浏览器，更神奇的是你在一个浏览器中滚动页面、点击按钮、输入框中输入信息等用户行为也会同步到每个浏览器中。

<!--more-->

### 安装`browser-sync`模块

```
    npm install browser-sync -g
```

### 命令行直接使用

```
    browser-sync start --server --files "css/*.css"
```

使用上面命令会开启一个迷你服务器，自动帮你打开浏览器，默认地址`localhost:3000`，默认打开`index.html`，如果没有，需要手动加上你要打开的页面，如`localhost:3000/test.html`。

通常你不会需要默认的地址，所以需要使用代理模式：

```
    browser-sync start --proxy "localhost:8080" --files "css/*.css"
```

### Browsersync + Gulp

```
    var gulp = require('gulp'),
        sass = require('gulp-ruby-sass'),
        autoprefixer = require('gulp-autoprefixer'),
        minifycss = require('gulp-minify-css'),
        rename = require('gulp-rename'),
        notify = require('gulp-notify');

    var browserSync = require('browser-sync').create();

    gulp.task('sass', function() {
        return sass('sass/style.scss', {style: "expanded"})
            //.pipe(sass({style: "expanded"}))
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
            .pipe(rename({suffix: '.min'}))
            .pipe(minifycss())
            .pipe(gulp.dest('css'))
            .pipe(notify({ message: 'Styles task complete' }))
            .pipe(browserSync.stream());
    });

    gulp.task('serve', ['sass'], function() {
        browserSync.init({
            server: "./"
        });

        gulp.watch("sass/*.scss", ['sass']);
        gulp.watch("*.html").on('change', browserSync.reload);
    });

    gulp.task('default', ['serve']);
```

其中

```
    gulp.watch("sass/*.scss", ['sass']);
```

会在编译完sass后，以无刷新方式更新页面。

```
    gulp.watch("*.html").on('change', browserSync.reload);
```

会在修改html文件后刷新页面。

如果需要在修改js后刷新页面，可以像下面这样：

```
    gulp.task('sass', function() {
        return sass('sass/style.scss', {style: "expanded"})
            //.pipe(sass({style: "expanded"}))
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
            .pipe(rename({suffix: '.min'}))
            .pipe(minifycss())
            .pipe(gulp.dest('css'))
            .pipe(notify({ message: 'Styles task complete' }))
            .pipe(browserSync.stream());
    });

    gulp.task('js', function () {
        return gulp.src('js/*js')
            .pipe(browserify())
            .pipe(uglify())
            .pipe(gulp.dest('dist/js'))
            .pipe(browserSync.stream());;
    });

    gulp.task('serve', ['sass', 'js'], function() {
        browserSync.init({
            server: "./"
        });

        gulp.watch("sass/*.scss", ['sass']);
        gulp.watch("*.html").on('change', browserSync.reload);
        gulp.watch("js/*.js", ['js'])
    });

    gulp.task('default', ['serve']);
```

BrowserSync确实是一个好东西！
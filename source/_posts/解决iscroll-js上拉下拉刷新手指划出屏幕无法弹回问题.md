title: 解决iscroll.js上拉下拉刷新手指划出屏幕页面无法回弹问题
date: 2016-02-17 20:41:50
categories: "JavaScript"
tags: ["iscroll.js", "无法回弹", "上拉下拉刷新"]
---

![](/assets/blogImg/20150102_a4ddb186ca87d8af09a3bf9f7c8d6df0.jpg)

使用过iscroll.js的上拉下拉刷新效果的朋友应该都碰到过这个问题：在iOS的浏览器中，上拉或下拉刷新时，当手指划出屏幕后，页面无法弹回。很多人因为解决不了这个问题，干脆就那样不解决了，还有的直接就不用HTML了，使用原生代替HTML页面。

<!--more-->

相信很多朋友也有自己的解决办法，只是没写出来，所以网上都搜不到解决方案。在很多QQ群里面也有很多人在问该怎么解决这个问题，所以我写这篇文章记录一下我的解决方案，希望对一些朋友有所帮助。

上拉下拉刷新的主要代码：

```
    myScroll = new iScroll('wrapper', {
        vScrollbar: false,
        useTransition: true,
        topOffset: pullDownOffset,
        onRefresh: function () {
            if (pullDownEl.className.match('loading')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
            } else if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
            }
        },
        onScrollMove: function () {
            if (this.y > 5 && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
                this.minScrollY = 0;
            } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                this.minScrollY = -pullDownOffset;
            } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
                this.maxScrollY = pullUpOffset;
            }
        },
        onScrollEnd: function () {
            if (pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';
                pullDownAction();
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';
                pullUpAction();
            }
        }
    });
```

页面无法弹回的原因在于：手指划出屏幕后`touchend`事件无法触发，回弹动画就无法执行。解决办法就是：当手指接近屏幕边缘的时候，手动触发动画方法。

在`onScrollMove`方法中插入判断代码：

```
        onScrollMove: function () {
            if((this.y < this.maxScrollY) && (this.pointY < 1)){
                this.scrollTo(0, this.maxScrollY, 400);
                return;
            } else if (this.y > 0 && (this.pointY > window.innerHeight - 1)) {
                this.scrollTo(0, 0, 400);
                return;
            }

            ......
        }
```

下面解释一下这段代码的意思。

`this.y`是页面已经滚动的垂直距离，`this.maxScrollY`是最大垂直滚动距离，`this.pointY`手指当前的垂直坐标。

当`this.y < this.maxScrollY`，就是已经处于上拉的过程，当`(this.y < this.maxScrollY) && (this.pointY < 1)`时，处于上拉且手指已经触及屏幕边缘，这时候手动触发`this.scrollTo(0, this.maxScrollY, 400)`，页面就开始回弹。

下拉过程也可以同理分析。

欢迎留下你的解决方法。






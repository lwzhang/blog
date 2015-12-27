title: "Flexbox + js实现滑动拼图游戏"
date: "2015-08-23"
categories: "JavaScript"
tags: ["flex", "滑动拼图"]
---

滑动拼图就是把一张图片分成几等份，打乱顺序（下图），然后通过滑动拼凑成一张完整的图片。
![](/assets/blogImg/o_pintu.png)
<!--more-->
要实现一个拼图游戏，需要考虑怎样随机的打乱顺序，怎样交换两张图片的位置，等等。但是，使用了Flexbox布局以后，这都不需要你去考虑，浏览器会帮你做，Flexbox就是这么的强大。关于Flexbox的介绍可以点击[这里](http://www.w3cplus.com/css3/a-guide-to-flexbox-new.html)。

这个游戏中要用的是Flexbox布局的`order`属性，`order`属性可以用来控制Flex项目的顺序。

这里我用九个`canvas`元素来把图片分成九等分，也可以用其他方法，比如背景图片定位：

    <div class="wrap">
	    <canvas></canvas>
	    <canvas></canvas>
	    <canvas></canvas>
	    <canvas></canvas>
	    <canvas></canvas>
	    <canvas></canvas>
	    <canvas></canvas>
	    <canvas></canvas>
	    <canvas></canvas>
	</div>


如果不仅限于九宫格，还要十六宫格等，上面的元素完全可以动态生成。

下面是生成打乱顺序的九张图代码：

    var drawImage = function (url) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () {
                resolve(img);
            };
            img.src = url;
        })
    };

    drawImage("2.jpg").then(function (img) {
        var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var random = arr.sort(function() {return Math.random() > 0.5});
        [].forEach.call(document.querySelectorAll("canvas"), function (item, i) {
            item.width = $(".wrap").clientWidth / 3;
            item.height = $(".wrap").clientHeight / 3;
            item.style.order = random[i];
            var ctx = item.getContext("2d");
            ctx.drawImage(img, img.width * (i % 3) / 3, img.height * Math.floor(i / 3) / 3, img.width / 3, img.height / 3, 0, 0, item.width, item.height);
        });
    });


上面的关键代码是：

    item.style.order = random[i];

通过将数字打乱顺序，随机赋值给每个`canvas`元素的`order`属性，这样浏览器就自动帮你排序了。

关于代码的其他细节就不讲了，这里说一下怎样交换两张图片的位置，真是出乎意料的简单：

    var order1 = item.style.order;
    var order2 = target.style.order;

只需要交换双方的`order`属性值就可以了。

完整代码可以在[这里](https://github.com/lwzhang/pages/blob/gh-pages/puzzle/slide.html)查看。

DEMO可以点击[这里](https://lwzhang.github.io/pages/puzzle/slide.html)，最好用谷歌模拟器或者手机打开，因为只支持移动端触摸事件。

代码中只实现了基本功能，并没有实现完整功能。
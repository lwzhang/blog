title: "HTML5实现刮奖效果"
date: "2015-01-21"
category: "JavaScript"
tags: ["HTML5", "canvas", "刮奖效果"]
---

要实现刮奖效果，最重要的是要找到一种方法：当刮开上层的涂层是就能看到下层的结果。而HTML5的canvas API中有一个属性globalCompositeOperation，这个属性有多个值，而实现刮奖效果要用到的值就是destination-out。意思就是：在已有内容和新图形不重叠的地方，已有内容保留，所有其他内容成为透明。这样可能不好理解，后面实现的时候会解释。有了globalCompositeOperation这个属性，实现过程就很简单了。
<!--more-->
我们需要有两个层，上面一层肯定是一个canvas元素，因为要能刮开就要用到画布。下面一层其实用什么元素都可以，既然上层用的是canvas元素，下层我们也用canvas元素，下面是html内容：

    <!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF-8" />
		<title>刮刮乐</title>
	</head>
	<body>
	    <canvas id="underCanvas" width=300 height=300 style="position: absolute; left: 0;top: 0;"></canvas>
	    <canvas id="upCanvas" width=300 height=300 style="position: absolute; left: 0; top: 0;"></canvas>
	    <script src="./scratch.js"></script>
		<script>
	        // 可能变化的值放在options中，方便修改
	        var options = {
	            text: {
	                fontWeight: "bold",
	                fontSize: 30,
	                fontFamily: "Arial",
	                align: "center",
	                color: '#F60'
	            },
	            maskColor: "red",
	            radius: 30,
	            awards: ["一等奖", "二等奖", "三等奖", "谢谢！"]
	        };
	
	        new Scratch(options).init();
	    </script>
	</body>
	</html>

先实现一个构造函数：

    var Scratch = function (options) {
		// 下层画布元素
        this.underCanvas = doc.getElementById("underCanvas");
        // 上层画布元素
		this.upCanvas = doc.getElementById("upCanvas");
        // 获取下层画布绘图上下文
		this.underCtx = this.underCanvas.getContext("2d");
        // 获取上层画布绘图上下文
		this.upCtx = this.upCanvas.getContext("2d");
       	// 画布宽度
		this.width = this.upCanvas.width;
        // 画布高度
		this.height = this.upCanvas.height;
        // 自定义选项
		this.options = options;
        this.award = null;
    };

在下层画布上画上刮奖的内容：

	drawText: function () {
        var ctx = this.underCtx;
        var text = this.options.text;
        ctx.font = text.fontWeight + " " + text.fontSize + 'px ' + text.fontFamily;
        ctx.textAlign = text.align;
        ctx.fillStyle = text.color;
        this.award = this.options.awards[(Math.random() * this.options.awards.length) | 0]; //随机抽奖
        ctx.fillText(this.award, this.width / 2, this.height / 2 + text.fontSize / 2);
    }
这边奖的内容是随机出现的，因为奖肯定有很多种，可以用一个数组来存放奖的内容，然后随机显示：

    this.award = this.options.awards[(Math.random() * this.options.awards.length) | 0];

如果不知道上面的位运算是什么意思，可以参考我写的上一篇文章["js中位运算的运用"](http://www.cnblogs.com/xljzlw/p/4231354.html)。

然后在上层画布中画一层涂层：

    drawMask: function () {
        var ctx = this.upCtx;
        ctx.fillStyle = this.options.maskColor;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.globalCompositeOperation = 'destination-out';
    }
在上层画布中用了globalCompositeOperation这个属性，当再在画布上画东西时，那么后面画的内容和涂层重合的部分将变透明，而其余涂层部分不变。就是利用了这个原理实现了刮奖效果。

需要刮开上层的涂层，就需要在上层画布上绑定事件：

    addEvent: function () {
        var that = this;
        var upCanvas = this.upCanvas;
        var callback1, callback2, callback3;
        upCanvas.addEventListener("mousedown", callback1 = function (evt) {
            upCanvas.addEventListener("mousemove", callback2 = function (evt) {
                var x = evt.clientX - upCanvas.offsetLeft;
                var y = evt.clientY - upCanvas.offsetTop;
                var ctx = that.upCtx;
                var options = that.options;
                ctx.beginPath();
                var gradient = ctx.createRadialGradient(x, y, 0, x, y, options.radius);
                // 其实这边的颜色值是可以随便写的，因为都会变成透明，重要的是透明度
                gradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
                gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
				// 也可以不用渐变，直接用一种颜色，但渐变效果更好
                ctx.fillStyle = gradient;
                ctx.arc(x, y, options.radius, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.closePath();
				// 当刮开部分>80%的时候提醒刮奖结果，这个可以自己设置
                if (that.result() > 0.8) {
                    alert(that.award);
                    upCanvas.removeEventListener("mousemove", callback2);
                }
            }, false);
            doc.addEventListener("mouseup", callback3 = function () {
                upCanvas.removeEventListener("mousemove", callback2);
                doc.removeEventListener("mouseup", callback3);
            }, false);
        }, false);
    }

我们需要在刮到一定程度时提醒刮奖的结果：

    result: function () {
		// 获取文字部分的宽、高
        var textWidth = this.options.text.fontSize * this.award.length;
        var textHeight = this.options.text.fontSize;
        // 获取文字部分的像素，这样可以根据刮开文字的部分占全部文字部分的百分比来提示结果，比如说在刮开80%的时候提示刮奖结果
        var imgData = this.upCtx.getImageData(this.width / 2 - textWidth / 2, this.height / 2 - textHeight / 2, textWidth, textHeight);
        var pixelsArr = imgData.data;
        var transPixelsArr = [];
        for (var i = 0, j = pixelsArr.length; i < j; i += 4) {
            // a代表透明度
            var a = pixelsArr[i + 3];
            // 渐变的透明度＜=0.5，其实透明度的值是介于0~255之间的，0.5 * 255 = 127.5就是a的值
            if (a < 128) {
                transPixelsArr.push(a);
            }
        }
        // 小于128的透明度的值的个数占总透明度的的个数的百分比
        return transPixelsArr.length / (pixelsArr.length / 4);
    }

上面用到了getImageData()方法，这个方法返回像素数据。重要的是我们只是获取了下层文字部分的像素数据，因为我们只需要知道刮开的文字部分占全部文字部分的百分比。

调用构造函数时，把可能改变的东西放在一个对象options中传递给构造函数：

    // 可能变化的值放在options中，方便修改
    var options = {
		// 文字部分的样式
        text: {
            fontWeight: "bold",
            fontSize: 30,
            fontFamily: "Arial",
            align: "center",
            color: '#F60'
        },
		// 图层颜色
        maskColor: "red",
		// 画逼半径
        radius: 20,
		// 奖项
        awards: ["一等奖", "二等奖", "三等奖", "谢谢！"]
    };

    new Scratch(options).init();

完整代码可以查看Github：[https://github.com/lwzhang/scratch](https://github.com/lwzhang/scratch)

DEMO：[http://lwzhang.github.io/scratch/scratch.html](http://lwzhang.github.io/scratch/scratch.html)




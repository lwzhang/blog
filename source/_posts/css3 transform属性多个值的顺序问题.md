title: "css3 transform属性多个值的顺序问题"
date: "2015-11-14"
category: "CSS3"
tags: [" transform", "transform多值顺序"]
---

对于`transform`属性的多值的顺序问题，我自己就被困扰过。后来知道了跟顺序有关，但是不知道为什么。我想应该很多人跟我以前一样，知其然不知其所以然。如果不知道的，也许这篇文章会对大家有所帮助。
<!--more-->

先来看一个例子。

`html`代码:

		<div id="red1"></div>
		<div id="red2"></div>

`css`代码：

		body {
			margin: 0;
		}
		div {
			width:100px;
			height:100px;
			background:red;
		}
		#red1 {
			transform: rotate(45deg);
		}
		#red2 {
			transform: rotate(45deg) translate(100px, 100px);
		}

![](http://images.cnblogs.com/cnblogs_com/xljzlw/676183/o_QQ%e6%88%aa%e5%9b%be20151115170222.png)

红框一`transform`属性只有一个值`rotate(45deg)`，红框二多了一个值`translate(100px, 100px)`，水平和竖直都平移`100px`，但是从图中可以看到红框2只有竖直方向有位移。这是怎么回事？

其实，当旋转`45`度后，元素的整个坐标系都旋转了`45`度，如下图：

![](http://images.cnblogs.com/cnblogs_com/xljzlw/676183/o_QQ%e6%88%aa%e5%9b%be20151115171530.png)

图1就是正常的坐标系，图2就是旋转`45`度后的坐标系。所以红框二就按旋转后的坐标系进行平移。因为我设置的值比较特殊，所以只有在竖直方向有位移。通过计算红框二竖直向下平移了`100√2px`，也就是红框对角线的长度。

我们再来看一个例子。

`html`代码:

		<div id="red"></div>
		<div id="green"></div>

`css`代码：

		body {
			margin: 0;
		}
		div {
			width:100px;
			height:100px;
			position: absolute;
			top: 50px;
			left: 100px;
		}
		#red {
			background:red;
			transform: rotate(45deg) translate(100px, 100px);
		}
		#green {
			background:green;
			transform: translate(100px, 100px) rotate(45deg);
		}


![](http://images.cnblogs.com/cnblogs_com/xljzlw/676183/o_QQ%e6%88%aa%e5%9b%be20151115173609.png)


图中可以看到，值的顺序对元素位置的影响。通过上面的介绍知道，红框先旋转再平移，即先旋转坐标系再平移，而绿框先按正常的坐标系平移，再旋转，所以它们的位置就不同了。

我们可以举一反三，比如`3d`旋转等都可以按上面的方法去分析。

(完)


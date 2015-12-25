title: "元素rotate之后，宽度该怎么计算？"
date: "2015-11-13"
category: "CSS3"
tags: ["transform", "rotate"]
---

通常，利用`transform: rotate()`元素之后，我们并不会去在意元素大小的变化，因为看上去并没有什么变化。虽然看上去没有变化，其实是有变化的。下面用一个例子来说明一下。
<!--more-->

`html`：

		<div id="rect"></div>

`css`：
		 
		div {
			width:100px;
			height:100px;
			margin: 100px auto;
			background:red;
			transform: rotate(45deg);
		}

效果如下：


![](http://images.cnblogs.com/cnblogs_com/xljzlw/676183/o_QQ%e5%9b%be%e7%89%8720151113214149.png)

图中四边形的宽高都是`100px`，然后旋转了`45`度，当用浏览器查看它的宽高时就变成了`141.421px`。浏览器是怎么计算的呢？简单画了一个草图。
![](http://images.cnblogs.com/cnblogs_com/xljzlw/676183/o_QQ%e6%88%aa%e5%9b%be20151113215400.png)


旋转之后，元素的大小其实就变成了红色框的大小，很容易可以计算得到红色框的宽高为`141.421px`。

**注意：当你用js获取元素的宽度时，返回的还是`100px`，因为css设置的宽度是`100px`，js获取的是css的值。**

旋转之后的元素，不仅大小变化了，元素的位置也变了：

		$("#rect").offset()
上面代码输出：

		Object {top: 79.28932189941406, left: 404.289306640625}

其实浏览器计算的是红色框相对于文档的位置。

`transform: rotate(45deg)`是2D旋转，由此也可以联想到3D旋转也可以按相同的套路去计算。

(完)
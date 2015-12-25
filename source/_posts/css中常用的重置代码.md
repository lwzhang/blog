title: "css中常用的重置代码"
date: "2015-07-14"
category: "CSS3"
tags: ["placeholder", "小三角", "spinners", "滚动条"]
---

在制作页面时，经常会遇到需要自定义一些标签的默认行为(如：input的占位符等)，但这些默认的设置的css一般比较难记住,所以有必要自己做一下记录。下面是我经常用到的一些重设默认行为的css。
<!--more-->
### 1、占位符 ###

在`<input>`标签中设置`placeholder`属性时，有时候因为需求，要修改占位符的默认颜色或者字体大小，这是就可以用下面的css:

	// firefox    
	input::-moz-placeholder {
            color: red;
            font-size: 18px;
        }
	
	// IE
    input:-ms-input-placeholder {
        color: red;
        font-size: 18px;
    }

	// chrome
    input::-webkit-input-placeholder {
    	color: red;
        font-size: 18px;
    }

需要注意的是不同浏览器写法不同：

1. 都要加上各自浏览器的前缀(如`-webkit-`)；
2. firefox的`placeholder`的前面没有`input-`；
3. firefox与chrome都是`::`两个冒号，而IE则是一个`:`;
4. 低版本的浏览器与新版本浏览器可能写法不同；

###2、下拉框的小三角###

`select`标签会出现小三角,通常这个小三角我都会去掉，或者用背景图片的方式替换为符合要求的样子。去掉小三角的css：

    -webkit-appearance: none;
    -moz-appearance: none;

在IE浏览器中目前还没找到可以去掉小三角的方法。

###3、input[type=number]右边的spinners###

`nput[type=number]`通常用在移动端设备上，浏览器会识别number输入类型，然后改变数字键盘来适应它。但是它会出现spinners，一般不需要它。去掉spinners的css如下：

    // firefox
	input[type='number'] {
    	-moz-appearance:textfield;
	}

	// chrome
	input[type=number]::-webkit-inner-spin-button,
	input[type=number]::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

###4、-webkit-tap-highlight-color###

在移动端浏览器上(如是微信、QQ内置浏览器)，当你点击一个链接或者通过Javascript定义的可点击元素的时候，会出现蓝色边框，我是很讨厌这个边框的，所以一般我会去除：

    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);

将高亮色设为透明，这样就看不到蓝色边框了。

###5、滚动条###

webkit现在支持拥有overflow属性的区域，列表框，下拉菜单，textarea的滚动条自定义样式。有时候需要把滚动条去掉，特别是页面中出现几条滚动条的时候：

    ::-webkit-scrollbar {
		width: 0;
	}

设置滚动条的宽度为0就可以去除滚动条了。如果需要自定义滚动条样式可以点击[http://www.xuanfengge.com/css3-webkit-scrollbar.html](http://www.xuanfengge.com/css3-webkit-scrollbar.html)，里面介绍了如何自定义滚动条样式。

上面记录了我在项目中常用的比较不容易记忆的css代码。如果朋友们也有比较常用的不太容易记住的css代码，欢迎帮忙补充。
title: "Sass与Compass合并雪碧图(二)"
date: "2015-08-30"
categories: "SASS"
tags: ["sprite", "sprites", "sass", "compass", "雪碧图", "合并图片"]
---

上一篇文章介绍了怎样使用`compass`合并雪碧图，生成的`icons.css`文件中单位是`px`，PC端可以直接在html文件中使用，但在移动端，我们需要根据不同分辨率的屏幕，来缩放图片大小，显然使用`px`单位肯定是不行的。所以需要做一下单位转换的工作。
<!--more-->
移动端使用`rem`作为单位是最合适不过了。并不是使用了`rem`就可以，还需要做一些准备工作。我们都知道`rem`是基于`html`标签的`font-size`的，所以需要使用js动态的计算`html`的`font-size`。这里我使用淘宝的[`lib-flexible`](https://github.com/amfe/lib-flexible)。

在上一篇文章中，有讲过雪碧地图（Sprite maps），如下面：

	$icons: sprite-map("icons/*.png", $spacing: 8px, $layout: smart);

	.icon {
    	width: image-width(sprite-file($icons, card-icon));
    	height: image-height(sprite-file($icons, card-icon));
		background-image: sprite-url($icons);
	}

生成css:

	.icon {
		width: 77px;
		height: 64px;
		background-image: url('/images/icons-s37f950be3b.png');
	}

现在，需要把`px`转换成`rem`。我们不可能在`icons.css`中转换，应该在`icons.scss`文件中转换。

在`icons.scss`声明一个转换函数`px2rem`：
	
	@function px2rem ($px) {
		@return $px / 64px * 1rem;
	}
	 
这里的`64`是因为视觉稿是`640px`的，如果是`750px`的就是`75`。可以看一下[`lib-flexible`](https://github.com/amfe/lib-flexible)的说明。

加上转换函数的`icons.scss`文件是这样的：

	$icons: sprite-map("icons/*.png", $spacing: 8px, $layout: smart);

	@function px2rem ($px) {
		@return $px / 64px * 1rem;
	}

	.icon {
    	width: px2rem(image-width(sprite-file($icons, card-icon)));
    	height: px2rem(image-height(sprite-file($icons, card-icon)));
		background-image: sprite-url($icons);;
	}

生成的`css`如下：

	.icon {
		width: 1.20313rem;
		height: 1rem;
		background-image: url('/images/icons-s37f950be3b.png');
	}

好了，第一步转换工作就完成了。我们都知道，使用雪碧图，肯定要使用`background-position`属性,它的单位也是`px`，也需要转换，所以需要在`icons.scss`加上：
	
	$icons: sprite-map("icons/*.png", $spacing: 8px, $layout: smart);

	@function px2rem ($px) {
		@return $px / 64px * 1rem;
	}

	.icon {
    	width: px2rem(image-width(sprite-file($icons, card-icon)));
    	height: px2rem(image-height(sprite-file($icons, card-icon)));
		background-image: sprite-url($icons);
		background-position: px2rem(sprite-position($icons, car-icon));
	}
但是，编译的时候出错了，错误如下：
![](/assets/blogImg/o_20150830131155.png)

意思就是：`background-position`的值为`-250px 0`，并不能简单的使用`px2rem`函数，那该怎么办？我们先来判断一下传递给函数的参数的类型：
	
	@function px2rem ($px) {
		@warn type-of($px);
		@return $px / 64px * 1rem;
	}

再次编译(可以使用`compass watch`进行监听文件的修改)，命令行提示如下图:

![](/assets/blogImg/o_20150830131942.png)

从图中可以知道：`$width`、`$height`的类型是`number`,而`$pos`类型是`list`。知道了什么类型就可以对症下药了，修改函数如下：

	@function px2rem ($px) {
		@if (type-of($px) == "number") {
    		@return $px / 64px * 1rem;
		}

		@if (type-of($px) == "list") {
			@return nth($px, 1) / 64px *1rem nth($px, 2) / 64px * 1rem;
		}
	}

`nth`方法可以取出`list`中的每一项进行运算，输出css如下：

	.icon {
		width: 1.20313rem;
		height: 1rem;
		background-image: url('/images/icons-s37f950be3b.png');
		background-position: -1.46875rem -1.40625rem;
	}

这边又会有个问题：`background-position`的值优有可能是`0 0`、`0 100px`或者`100px 0`，而`0`是没有单位的，这样转换的时候会报错，继续对`px2rem`函数进行改造，如下：
	
	@function px2rem ($px) {
		@if (type-of($px) == "number") {
    		@return $px / 64px * 1rem;
		}
	
		@if (type-of($px) == "list") {
      		@if (nth($px, 1) == 0 and nth($px, 2) != 0) {
        		@return 0 nth($px, 2) / 64px * 1rem;
      		} @else if (nth($px, 1) == 0 and nth($px, 2) == 0) {
        		@return 0 0;
      		} @else if (nth($px, 1) != 0 and nth($px, 2) == 0) {
        		@return nth($px, 1) / 64px * 1rem 0;
      		} @else {
        		@return nth($px, 1) / 64px *1rem nth($px, 2) / 64px * 1rem;
      		}
		}
	}
	
上面对各种为`0`的情况进行了判断，避免了错误。

下面还需要对`background-size`属性进行转换。在PC端如果图片不要缩放的话，其实不需要该属性，但在移动端一般是需要的。在移动端，可能很多人不知道该怎么用`background-size`属性，到底是设置整个雪碧图的大小，还是设置单个sprite的的大小呢？其实是设置整个雪碧图的大小。


好像`compass`没有内置的方法获得雪碧图的大小，没关系，我们可以等到雪碧图生成的时候，再去查看雪碧图的大小。可以先用两个变量保存雪碧图的宽高，初始化为`0`：

	$bigWidth: 0;
	$bigHeight: 0;

等雪碧图生成后，查看图片大小，再修改，如：

	$bigWidth: 242px;
	$bigHeight: 270px;

这时`icons.scss`文件内容如下：

	$icons: sprite-map("icons/*.png", $spacing: 8px, $layout: smart);

	$bigWidth: 242px;
	$bigHeight: 270px;
	
	@function px2rem ($px) {
		@if (type-of($px) == "number") {
    		@return $px / 64px * 1rem;
		}
		
		@if (type-of($px) == "list") {
      		@if (nth($px, 1) == 0 and nth($px, 2) != 0) {
        		@return 0 nth($px, 2) / 64px * 1rem;
      		} @else if (nth($px, 1) == 0 and nth($px, 2) == 0)  {
        		@return 0 0;
      		} @else if (nth($px, 1) != 0 and nth($px, 2) == 0) {
        		@return nth($px, 1) / 64px * 1rem 0;
      		} @else {
        		@return nth($px, 1) / 64px *1rem nth($px, 2) / 64px * 1rem;
      		}
		}
	}
	
	.icon {
    	width: px2rem(image-width(sprite-file($icons, card-icon)));
    	height: px2rem(image-height(sprite-file($icons, card-icon)));
    	background-image: sprite-url($icons);
    	background-position: px2rem(sprite-position($icons, card-icon));
    	background-size: px2rem(($bigWidth, $bigHeight));
    	background-repeat: no-repeat;
	}

生成`css`如下：

	.icon {
		width: 1.20313rem;
		height: 1rem;
		background-image: url('/images/icons-s37f950be3b.png');
		background-position: -1.46875rem -1.40625rem;
		background-size: 3.78125rem 4.21875rem;
		background-repeat: no-repeat;
	}

到这里，应该可以说是很完美了，但还有改进的空间。我们需要自定义很多类，如：

	.icon1 {
    	width: px2rem(image-width(sprite-file($icons, card-icon)));
    	height: px2rem(image-height(sprite-file($icons, card-icon)));
    	background-image: sprite-url($icons);
    	background-position: px2rem(sprite-position($icons, card-icon));
    	background-size: px2rem(($bigWidth, $bigHeight));
    	background-repeat: no-repeat;
	}

	.icon2 {
    	width: px2rem(image-width(sprite-file($icons, watch-icon)));
    	height: px2rem(image-height(sprite-file($icons, watch-icon)));
    	background-image: sprite-url($icons);
    	background-position: px2rem(sprite-position($icons, watch-icon));
    	background-size: px2rem(($bigWidth, $bigHeight));
    	background-repeat: no-repeat;
	}

	......

上面的每个类中的属性都是一样的，为什么不使用一个`mixin`，把相同的属性都放进这个`mixin`中，然后在每个类中引入就可以了。下面来定义一个`mixin`：

	@mixin sprite-info ($icons, $name) {
		width: px2rem(image-width(sprite-file($icons, $name)));
		height: px2rem(image-height(sprite-file($icons, $name)));
		background-image: sprite-url($icons);
		background-position: px2rem(sprite-position($icons, $name));
		background-size: px2rem(($bigWidth, $bigHeight));
		background-repeat: no-repeat;
	}

使用这个`mixin`：

	.card {
		@include sprite-info($icons, card-icon);	
	}

	.watch {
		@include sprite-info($icons, watch-icon);	
	}


生成css如下：

	.card {
		width: 1.20313rem;
		height: 1rem;
		background-image: url('/images/icons-s37f950be3b.png');
		background-position: -1.46875rem -1.40625rem;
		background-size: 3.78125rem 4.21875rem;
		background-repeat: no-repeat;
	}

	.watch {
		width: 1.3125rem;
		height: 1.40625rem;
		background-image: url('/images/icons-s37f950be3b.png');
		background-position: 0 0;
		background-size: 3.78125rem 4.21875rem;
		background-repeat: no-repeat;
	}

现在可以说是非常完美了。下面贴出`icons.scss`文件中最终的代码：

	$icons: sprite-map("icons/*.png", $spacing: 8px, $layout: smart);

	$bigWidth: 242px;
	$bigHeight: 270px;

	@function px2rem ($px) {
		@if (type-of($px) == "number") {
    		@return $px / 64px * 1rem;
		}

		@if (type-of($px) == "list") {
      		@if (nth($px, 1) == 0 and nth($px, 2) != 0) {
        		@return 0 nth($px, 2) / 64px * 1rem;
      		} @else if (nth($px, 1) == 0 and nth($px, 2) == 0)  {
        		@return 0 0;
      		} @else if (nth($px, 1) != 0 and nth($px, 2) == 0) {
        		@return nth($px, 1) / 64px * 1rem 0;
      		} @else {
        		@return nth($px, 1) / 64px *1rem nth($px, 2) / 64px * 1rem;
      		}
		}
	}

	@mixin sprite-info ($icons, $name) {
		width: px2rem(image-width(sprite-file($icons, $name)));
		height: px2rem(image-height(sprite-file($icons, $name)));
		background-image: sprite-url($icons);
		background-position: px2rem(sprite-position($icons, $name));
		background-size: px2rem(($bigWidth, $bigHeight));
		background-repeat: no-repeat;
	}

	.card {
		@include sprite-info($icons, card-icon);
	}

	.watch {
		@include sprite-info($icons, watch-icon);
	}
	

生成的`icons.css`代码如下：

	.card {
		width: 1.20313rem;
		height: 1rem;
		background-image: url('/images/icons-s37f950be3b.png');
		background-position: -1.46875rem -1.40625rem;
		background-size: 3.78125rem 4.21875rem;
		background-repeat: no-repeat;
	}

	.watch {
		width: 1.3125rem;
		height: 1.40625rem;
		background-image: url('/images/icons-s37f950be3b.png');
		background-position: 0 0;
		background-size: 3.78125rem 4.21875rem;
		background-repeat: no-repeat;
	}


	
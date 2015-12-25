title: "Sass与Compass合并雪碧图(一)"
date: "2015-08-29"
category: ["CSS", "SASS"]
tags: ["sprite", "sprites", "sass", "compass", "雪碧图", "合并图片"]
---

雪碧图就是很多张小图片合并成一张大图片，以减少HTTP请求，从而提升加载速度。有很多软件可以合并雪碧图，但通常不太容易维护，使用compass生成雪碧图应该算是非常方便的方法了，可以轻松的生成雪碧图，而且易维护。
<!--more-->

## 安装sass与compass ##

安装sass可以参考[这里](http://www.w3cplus.com/sassguide/install.html)。

安装完sass以后，使用下面命令安装compass:

    > gem install compass

## 配置环境 ##

进入项目目录，使用下面命令初始化项目：

    > compass init

该命令会在当前目录中生成一些文件：

	- sass
	  |-- ie.scss
      |-- print.scss
	  |-- screen.scss
 
	- stylesheets
	  |-- ie.sss
      |-- print.sss
	  |-- screen.sss
 
	  config.rb
	

其中sass与stylesheets文件夹中的文件基本上没什么用。config.rb配置文件中的内容一般不需要改动，也可以根据需要修改。

## 合并图片 ##

在当前目录下创建一个`images`的文件夹放置所有图片，然后在`images`文件夹中创建一个`icons`文件夹放置需要合并的图片。在sass文件夹中创建一个`icons.scss`文件，在文件中写入：

    @import "icons/*.png";
	@include all-icons-sprites;

然后，命令行执行`compass compile`命令，合并图片工作就已完成。`images`文件夹中多了一张`icons-*******.png`的图片。在`stylesheets`文件夹中会生成一个`icons.css`的文件：

    .icons-sprite, .icons-car-icon, .icons-card-icon, .icons-hand-icon, .icons-light, .icons-pan, .icons-title, .icons-watch-icon, .icons-wheel, .icons-wheel1 {
		background-image: url('/images/icons-sd6ae4306cd.png');
		background-repeat: no-repeat;
	}
		
	.icons-car-icon {
		background-position: 0 0;
	}
	
	.icons-card-icon {
		background-position: 0 -124px;
	}

	.....


## 自定义类名 ##

可以看到上面生成的css文件中的类名都是自动生成的，在实际应用中通常并不会使用上面的默认类名，这时需要自定义类名：

    @import "icons/*.png";
	.car-icon {
		@include icons-sprite(car-icon);	
	}
	

注意：`@include icons-sprite(car-icon)`不要写成`@include icons-sprites(car-icon)`，否则会有意想不到的结果。`@include all-icons-sprites`这句可以去掉，就不会生成默认的类名了。上面输出的结果为：

    .icons-sprite, .car-icon {
		background-image: url('/images/icons-sd6ae4306cd.png');
		background-repeat: no-repeat;
	}

	.car-icon {
		background-position: 0 0;
	}


## 雪碧地图(Sprite maps) ##

可以使用雪碧地图取代上面的`@import`，如下：

	$icons: sprite-map("icons/*.png", $spacing: 8px, $layout: horizontal);
	.car-icon {
    	background-image: sprite-url($icons);
    	width: image-width(sprite-file($icons, car-icon));
    	height: image-height(sprite-file($icons, car-icon));
    	background-position: sprite-position($icons, car-icon);
		background-repeat: no-repeat;
	}

结果：

	.car-icon {
		background-image: url('/images/icons-s6844bf5750.png');
		width: 242px;
		height: 116px;
		background-position: 0 0;
		background-repeat: no-repeat;
	}

上面使用了很多compass内置的方法：

	
    sprite-url($icons); //获取合并后雪碧图的url；
    sprite-file($icons, $name); //获取目标icon；
	image-width(); //获取图片宽度；
    image-height(); //获取图片高度；
    sprite-position($icons, $name); //获取图片坐标  
    
## 设置图片尺寸 ##

之前生成的css文件中并没有设置图片的尺寸，一般情况下是需要设置的。可以通过下面的设置设置图片尺寸：

	$icons-sprite-dimensions: true;

输出结果：

    .car-icon {
		background-position: 0 0;
		height: 116px;
		width: 242px;
	}

上面的设置会为每张图图片添加尺寸，也可以指定为某张图片添加尺寸：

	.car-icon {
		@include icons-sprite(car-icon);
		width: icons-sprite-width(car-icon);
		height: icons-sprite-height(car-icon);
	}

## 布局方式 ##

布局方式就是生成的雪碧图中小图片的排列方式。compass提供了四中排列方法：vertical、horizontal、diagonal和smart。默认排列方式是vertical。

使用方法就是在`icons.scss`文件中加上：

	$icons-layout: "vertical";

其他方式用法一样。

下面是四种布局生成的图片：
<div style="text-align:center">
<img src="http://images.cnblogs.com/cnblogs_com/xljzlw/676183/o_icons-s22b9e851cd.png" />
<img src="http://images.cnblogs.com/cnblogs_com/xljzlw/676183/o_icons-s37f950be3b.png" />
<img src="http://images.cnblogs.com/cnblogs_com/xljzlw/676183/o_icons-s4d555ef71f.png" />
<img src="http://images.cnblogs.com/cnblogs_com/xljzlw/676183/o_icons-sdd4c0db747.png" />
</div>


## 设置间距 ##

通常，我们会在图片与图片之间设置一定的间距，添加一下代码：

	$icons-spacing: 8px;

上面为图片之间设置了`8px`的间距。

## 总结： ##
上面简单介绍了使用compass制作雪碧图。在使用生成的css文件时会有一个问题：在PC端我们可以直接使用生成的css文件，但在移动端并不能直接使用，因为移动端需要缩放图片以适应不同分辨率的屏幕。然而生成的css文件的宽高都是使用绝对单位`px`的，这样在移动端并不适用。由于篇幅原因，我会在下一篇介绍在移动端怎样使用compass生成的雪碧图。
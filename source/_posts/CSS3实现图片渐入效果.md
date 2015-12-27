title: "CSS3实现图片渐入效果"
date: "2015-03-07"
categories: "CSS3"
tags: ["transition", "transform", "图片渐入效果"]
---

很多网站都有那种图片渐入的效果，如：[http://www.mi.com/minote/](http://www.mi.com/minote/)，这种效果用css3和一些js实现起来特别简单。
<!--more-->
拿我之前做的页面来说一下怎么利用css3来实现图片渐入效果。

下面是页面中的一段html：

    <div class="features">
        <div class="container">
            <div class="inner feature">
                <div class="content">
                    <h2 class="title"><img src="./imgs/title1.png" alt=""/></h2>
                    <p class="text">256位SSL加密安全连接，手机短信验证、谷歌两步验证、资金密码、邮箱验证四重验证保障安全，钱包分布式离线冷存储</p>
                </div>
                <img class="icon" src="./imgs/feature-icon1.png" alt=""/>
            </div>
        </div>
        <div class="container middle">
            <div class="inner feature">
                <div class="content">
                    <h2 class="title"><img src="./imgs/title1.png" alt=""/></h2>
                    <p class="text">256位SSL加密安全连接，手机短信验证、谷歌两步验证、资金密码、邮箱验证四重验证保障安全，钱包分布式离线冷存储</p>
                </div>
                <img class="icon" src="./imgs/feature-icon2.png" alt=""/>
            </div>
        </div>
        <div class="container">
            <div class="inner feature">
                <div class="content">
                    <h2 class="title"><img src="./imgs/title1.png" alt=""/></h2>
                    <p class="text">256位SSL加密安全连接，手机短信验证、谷歌两步验证、资金密码、邮箱验证四重验证保障安全，钱包分布式离线冷存储</p>
                </div>
                <img class="icon" src="./imgs/feature-icon3.png" alt=""/>
            </div>
        </div>
    </div>
    
首先，需要先定位图片，把图片定位在渐入后最终停留的位置：

    .feature .icon {
    	position: absolute;
    	top: 100px;
	}

接着，利用css3的transform属性和translate()方法实现图片的偏移，还有就是将图片透明度设为0(即完全透明)：

    .feature .icon {
	    position: absolute;
	    top: 100px;
	    transform: translate3d(0, 0, 150px);
	    -ms-transform: translate3d(0, 150px, 0);
	    -webkit-transform: translate3d(0, 150px, 0);
	    -o-transform: translate3d(0, 150px, 0);
	    -moz-transform: translate3d(0, 150px, 0);
		opacity: 0;
	}

这边需要加上各浏览器的前缀来兼容一些低版本浏览器。这些属性和方法的具体用法这边就细讲了。

然后，要用到的是css3的transition属性：

    .feature .icon {
	    position: absolute;
	    top: 100px;
	    transform: translate3d(0, 0, 150px);
	    -ms-transform: translate3d(0, 150px, 0);
	    -webkit-transform: translate3d(0, 150px, 0);
	    -o-transform: translate3d(0, 150px, 0);
	    -moz-transform: translate3d(0, 150px, 0);
		opacity: 0;
	    transition: transform 1s ease 0s, opacity 1s ease 0s;
	    -moz-transition: -moz-transform 1s ease 0s, opacity 1s ease 0s;
	    -webkit-transition: -webkit-transform 1s ease 0s, opacity 1s ease 0s;
	    -o-transition: -o-transform 1s ease 0s, opacity 1s ease 0s;
	    -ms-transition: -ms-transform 1s ease 0s, opacity 1s ease 0s;
	}

transition属性是一个过渡属性，当元素从一种样式变换为另一种样式时为元素添加效果。

到这还没有效果。我们要达到的效果是：当网页往下滚动，图片出现或将要出现在视窗时，我们来触发这个过渡效果，就像大家看到的下面这张图片一样。这个做法就像图片的惰性加载，图片还没出现在视窗中时，先不加载，出现时再去加载图片，这样的效果就是用户访问页面的速度提升了。


<div style="width: 400px; height: 400px; position: relative">
   <img class="transImg" style="width: 400px; height: 400px; position: absolute; top: 0; transform: translate3d(0, 150px, 0);-ms-transform: translate3d(0, 150px, 0); -webkit-transform: translate3d(0, 150px, 0); -o-transform: translate3d(0, 150px, 0); -moz-transform: translate3d(0, 150px, 0); opacity: 0; transition: transform 1s ease 0s, opacity 1s ease 0s; -moz-transition: -moz-transform 1s ease 0s, opacity 1s ease 0s; -webkit-transition: -webkit-transform 1s ease 0s, opacity 1s ease 0s; -o-transition: -o-transform 1s ease 0s, opacity 1s ease 0s; -ms-transition: -ms-transform 1s ease 0s, opacity 1s ease 0s;" src="/assets/blogImg/o_300001295750131174054755371_950.jpg" />
	<script>
		(function (win) {
			$(function(){
        		$(win).scroll(function() {
            		var windowPageYOffset = window.pageYOffset,
            		windowPageYOffsetAddHeight = windowPageYOffset + window.innerHeight;

                	var imgOffsetTop = $(".transImg").offset().top;
                	if (imgOffsetTop >= windowPageYOffset && imgOffsetTop < windowPageYOffsetAddHeight) {
                    	$(".transImg").css({
                        	"transform": "translate3d(0, 0, 0)",
                        	"-ms-transform": "translate3d(0, 0, 0)",
                        	"-o-transform": "translate3d(0, 0, 0)",
                        	"-webkit-transform": "translate3d(0, 0, 0)",
                        	"-moz-transform": "translate3d(0, 0, 0)",
                        	"opacity": 1
                    	});
                	}
				})
			})
		}(window))
	</script>
</div>

当页面往下滚动时，用js判断图片在什么时候触发动画：

    (function (win) {
		$(function(){
    		$(win).scroll(function() {
				// 浏览器窗口的高度 
        		var windowPageYOffset = win.pageYOffset;
				// 浏览器窗口的高度 + 页面滚动的距离    
        		var windowPageYOffsetAddHeight = windowPageYOffset + window.innerHeight;
				// 该值越小，越早触发效果，自己随便设置
				var sensitivity = 0;
      
            	var imgOffsetTop = $(".transImg").offset().top;
            	if (imgOffsetTop >= windowPageYOffset && imgOffsetTop < windowPageYOffsetAddHeight + sensitivity) {
                	// 达到一定位置，触发效果，透明度变为1
					$(".transImg").css({
                    	"transform": "translate3d(0, 0, 0)",
                    	"-ms-transform": "translate3d(0, 0, 0)",
                    	"-o-transform": "translate3d(0, 0, 0)",
                    	"-webkit-transform": "translate3d(0, 0, 0)",
                    	"-moz-transform": "translate3d(0, 0, 0)",
                    	"opacity": 1
                	});
            	}
			})
		})
	}(window))

完整代码可以查看：[https://github.com/lwzhang/practice/tree/gh-pages/biteduo](https://github.com/lwzhang/practice/tree/gh-pages/biteduo)

DEMO：[https://lwzhang.github.io/practice/biteduo/index.html](https://lwzhang.github.io/practice/biteduo/index.html)
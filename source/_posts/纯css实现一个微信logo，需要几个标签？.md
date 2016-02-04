title: 纯CSS实现一个微信logo，需要几个标签？
date: 2016-02-04 11:13:24
categories: "CSS3"
tags: ["CSS3", "微信Logo"]
---

![](/assets/blogImg/QQ图片20160204131450.png)

纯CSS实现一个微信logo并不难，难的是怎样用最少的`html`标签实现。我一直在想怎样用一个标签就能实现，最后还是没想出来，就只好用两个标签了。
<!--more-->

首先需要两个标签元素：

```
    <div class="bg">
        <div class="inner"></div>
    </div>
```

先画个背景：

```
    .bg {
        width: 300px;
        height: 300px;
        background-color: #08c406;
        border-radius: 10px;
        position: relative;
    }
```

再画个大的椭圆：

```
    .inner {
        width: 180px;
        height: 150px;
        border-radius: 50%;
        background-color: #fff;
        position: absolute;
        top: 60px;
        left: 35px;
    }
```

小的椭圆利用`.inner`的`::before`伪元素实现：

```
    &::before {
        content: "";
        width: 140px;
        height: 120px;
        border-radius: 50%;
        background-color: #fff;
        position: absolute;
        top: 60px;
        left: 90px;
        border: 2px solid #08c406;
    }
```

下图时现在的结果：

![](/assets/blogImg/QQ图片20160204200254.png)

里面的四个圆怎么画呢？可以利用CSS3的`box-shadow`属性实现，一般重复性的东西都会用这个属性，因为它可以制造出无数个一模一样的东西出来。

利用`.bg`的`::before`伪元素实现这些圆：

```
    &::before {
       content: "";
       position: absolute;
       width: 16px;
       height: 16px;
       border-radius: 50%;
       background-color: #08c406;
       top: 150px;
       left: 155px;
       z-index: 2;
       box-shadow: 70px 0 #08c406, -70px -50px 0 2px #08c406, 0 -50px 0 2px #08c406;
    }
```

`::before`本身会实现一个圆(一个小圆),然后利用`box-shadow`属性实现其它的三个圆。

来看看现在的效果：

![](/assets/blogImg/QQ图片20160204201338.png)

现在就剩下两个角了，想想还有哪些东西没用上？还有两个伪元素，分别是`.bg`的`::after`和`.inner`的`::after`，刚好可以实现两个角。

这两个角其实就是平常的小三角，然后再旋转个`45`度，`CSS`实现小三角太常见了：

```
    .bg::after {
        content: "";
        border-width: 30px 12px;
        border-style: solid;
        border-color: #fff transparent transparent transparent;
        position: absolute;
        top: 182px;
        left: 50px;
        transform: rotate(45deg);
    }

    .inner::after {
        content: "";
        border-width: 30px 10px;
        border-style: solid;
        border-color: #fff transparent transparent transparent;
        position: absolute;
        top: 155px;
        left: 200px;
        transform: rotate(-45deg);
    }
```

最终效果：

![](/assets/blogImg/QQ图片20160204131450.png)

全部`css`代码：

```
    @mixin pos($left, $top) {
      position: absolute;
      left: $left;
      top: $top;
    }

    .bg {
      width: 300px;
      height: 300px;
      background-color: #08c406;
      border-radius: 10px;
      position: relative;

      &::before {
       @include pos(155px, 150px);
       content: "";
       width: 16px;
       height: 16px;
       border-radius: 50%;
       background-color: #08c406;
       z-index: 2;
       box-shadow: 70px 0 #08c406, -70px -50px 0 2px #08c406, 0 -50px 0 2px #08c406;
      }

      &::after {
       @include pos(50px, 182px);
       content: "";
       border-width: 30px 12px;
       border-style: solid;
       border-color: #fff transparent transparent transparent;
       transform: rotate(45deg);
     }

     .inner {
       width: 180px;
       height: 150px;
       border-radius: 50%;
       background-color: #fff;
       @include pos(35px, 60px);

       &::before {
        @include pos(90px, 60px);
        content: "";
        width: 140px;
        height: 120px;
        border-radius: 50%;
        background-color: #fff;
        border: 2px solid #08c406;
       }

       &::after {
        @include pos(200px, 155px);
        content: "";
        border-width: 30px 10px;
        border-style: solid;
        border-color: #fff transparent transparent transparent;
        transform: rotate(-45deg);
       }
      }
    }
```

画这个logo最难的地方应该就是实现四个小圆的时候，因为`CSS3`不太熟的人可能不会想到利用`box-shadow`去实现。

大家还有其它的方法实现微信logo吗？有没有一个标签就能实现的？欢迎留下你的实现方式。
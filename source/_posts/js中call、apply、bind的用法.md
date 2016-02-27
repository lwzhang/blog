title: js中call、apply、bind的用法
date: 2014-06-07 18:45:27
categories: "JavaScript"
tags: ["call", "apply", "bind"]
---

今天看博客时，看到了这样的一段js代码：

```
var bind = Function.prototype.call.bind(Function.prototype.bind);
```

我想突然看到这样的一段代码，即使js能力再强的人，可能也需要花点时间去理解。像我这样的菜鸟就更不用说了。其实，原文已经对这端代码做出了解释，但我还是想用我的想法去解释这段代码。

<!--more-->

上面那段代码涉及到了`call`、`bind`，所以我想先区别一下`call`、`apply`、`bind`的用法。这三个方法的用法非常相似，将函数绑定到上下文中，即用来改变函数中`this`的指向。举个例子：

```
var zlw = {
    name: "zlw",
    sayHello: function (age) {
         console.log("hello, i am ", this.name + " " + age " years old");
     }
};

var  xlj = {
    name: "xlj",
};

zlw.sayHello(24);// hello, i am zlw 24 years old
```

下面看看`call`、`apply`方法的用法：

```
zlw.sayHello.call(xlj, 24);// hello, i am xlj 24 years old
zlw.sayHello.apply(xlj, [24]);// hello, i am xlj 24 years old
```

结果都相同。从写法上我们就能看出二者之间的异同。相同之处在于，第一个参数都是要绑定的上下文，后面的参数是要传递给调用该方法的函数的。不同之处在于，`call`方法传递给调用函数的参数是逐个列出的，而`apply`则是要写在数组中。

我们再来看看`bind`方法的用法：

```
zlw.sayHello.bind(xlj, 24)(); //hello, i am xlj 24 years old
zlw.sayHello.bind(xlj, [24])(); //hello, i am xlj 24 years old
```

`bind`方法传递给调用函数的参数可以逐个列出，也可以写在数组中。`bind`方法与`call`、`apply`最大的不同就是前者返回一个绑定上下文的函数，而后两者是直接执行了函数。由于这个原因，上面的代码也可以这样写:

```
zlw.sayHello.bind(xlj)(24); //hello, i am xlj 24 years old
zlw.sayHello.bind(xlj)([24]); //hello, i am xlj 24 years old
```

`bind`方法还可以这样写`fn.bind(obj, arg1)(arg2)`。

用一句话总结`bind`的用法：该方法创建一个新函数，称为绑定函数，绑定函数会以创建它时传入`bind`方法的第一个参数作为`this`，传入bind方法的第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数。

现在回到开始的那段代码：

```
var bind = Function.prototype.call.bind(Function.prototype.bind);
```

我们可以这样理解这段代码：

```
var bind = fn.bind(obj)
```

`fn `相当于`Function.prototype.call`，`obj`相当于`Function.prototype.bind`。而`fn.bind(obj)`一般可以写成这样`obj.fn`，为什么呢？因为`fn`绑定了`obj`，`fn`中的`this`就指向了`obj`。我们知道，函数中`this`的指向一般是指向调用该函数的对象。所以那段代码可以写成这样:

```
var bind = Function.prototype.bind.call;
```

大家想一想`Function.prototype.call.bind(Function.prototype.bind)`返回的是什么？

```
console.log(Function.prototype.call.bind(Function.prototype.bind)) // call()
```

返回的是`call`函数，但这个`call`函数中的上下文的指向是`Function.prototype.bind`。这个`call`函数可以这样用

```
var bind = Function.prototype.call.bind(Function.prototype.bind);

var zlw = {
    name: "zlw"
};

function hello () {
    console.log("hello, I am ", this.name);
}

bind(hello, zlw)() // hello, I am zlw
```

大家可能会感到疑惑，为什么是这样写`bind(hello, zlw)`而不是这样写`bind(zlw, hello)`？既然`Function.prototype.call.bind(Function.prototype.bind)`相当于`Function.prototype.bind.call`，那么先来看下`Function.prototype.bind.call`怎么用。`call`的用法大家都知道：

```
Function.prototype.bind.call(obj, arg)
```

其实就相当于`obj.bind(arg)`。我们需要的是`hello`函数绑定对象`zlw`，即`hello.bind(zlw)`也就是`Function.prototype.bind.call(hello, zlw)`，所以应该这样写`bind(hello, zlw)`。



现在又有一个疑问，既然`Function.prototype.call.bind(Function.prototype.bind)`相当于`Function.prototype.bind.call`，我们为什么要这么写：

```
var bind = Function.prototype.call.bind(Function.prototype.bind);
```

而不直接这样写呢：

```
var bind = Function.prototype.bind.call;
```

先来看一个例子：

```
var name = "xlj";
var zlw = {
    name: "zlw"
    hello: function () {
        console.log(this.name);
    }
};
zlw.hello(); // zlw

var hello = zlw.hello;
hello(); // xlj
```

有些人可能会意外，`hello()`的结果应该是`zlw`才对啊。其实，将`zlw.hello`赋值给变量`hello`，再调用`hello()`，`hello`函数中的`this`已经指向了`window`，与`zlw.hello`不再是同一个上下文，而全局变量`name`是`window`的一个属性，所以结果就是`xlj`。再看下面的代码：

```
var hello = zlw.hello.bind(zlw);
hello(); // zlw
```

结果是`zlw`，这时`hello`函数与`zlw.hello`是同一个上下文。其实上面的疑惑已经解开了，直接这样写：

```
var bind = Function.prototype.bind.call;
```

`bind`函数中的上下文已经与`Function.prototype.bind.call`中的不一样了，所以使用`bind`函数会出错。而这样写

```
var bind = Function.prototype.call.bind(Function.prototype.bind);
```

`bind`函数中的上下文与`Function.prototype.call.bind(Function.prototype.bind)`中是一样的。

关于这个这段代码的解释这到这边了，感觉语言组织能力不是很好，文章写得有些啰嗦了。文中可能会有错误，希望大家指正。
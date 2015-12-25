title: "JavaScript之函数科里化"
date: "2015-04-04"
category: "JavaScript"
tags: ["科里化", "curry", "currying"]
---

### 什么是柯里化(currying)？ ###

维基百科中的解释是：柯里化是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。意思就是当函数被调用时，返回的函数还需要设置一些传入的参数。
<!--more-->
首先来看一个简单的例子，有下面一个函数：

	function add(num1, num2) {
	  return num1 + num2;
	}

我们把它改写成下面这样：
    
	var fn = function(a) {
	  return function (b) {
        return a + b;
	  }
	}
可以这样调用函数：fn(2)(3)。上面使用了匿名函数来实现多参数函数的方法，虽然这并不是柯里化的函数，但可以帮助我们理解柯里化的含义。

###实现通用柯里化函数###
我们可以在内置构造函数Function()的原型上来添加一个柯里化函数，这样所有的函数都可以调用。下面是通用柯里化函数的实现：

    Function.prototype.currying = function () {
	  var that = this;
	  var args = [].slice.call(arguments);
	  return function () {
	    return that.apply(null, args.concat([].slice.call(arguments)));
	  }
	}

现在用柯里化函数将上面的`add`函数柯里化：

    var curriedAdd = add.currying(2);
	curriedAdd(3); // 5

也可以一次性传入两个参数：
	
	var curriedAdd = add.currying(2， 3);
	curriedAdd(); // 5

我们知道在原生对象的原型上扩展方法是不太好的，因为可能会导致命名冲突。所以最好不要把currying函数扩展在Function的原型上，下面是改写的currying函数：

	function currying(fn) {
	  var args = [].slice.call(arguments, 1);
	  return function () {
	    return that.apply(null, args.concat([].slice.call(arguments)));
	  }
	}
改写之后`currying`函数的第一个参数是要被柯里化的函数，可以这样调用：

    var curriedAdd = currying(add, 2);
	curriedAdd(3); // 5
	或
	var curriedAdd = currying(add, 2， 3);
	curriedAdd(); // 5

上面的`add`函数只是两个数字的相加，如果我们需要n个数字相加，上面的currying函数已经不能满足要求了，下面是修改后的currying函数：

    function currying(fn) {
	  var argsArr = [];
	  return function () {
	    if (arguments.length === 0) {
	      return fn.apply(null, argsArr);
	    } else {
	      [].push.apply(argsArr, arguments);
	    }
	  }
	}

多个数字相加：

	var add = function () {
	  var num = 0;
	  [].forEach.call(arguments, function (item, i) {
        num += item;
	  })
	  return num;	
	}

	var curriedAdd = currying(add);
	curriedAdd(2);
	curriedAdd(3);
	curriedAdd(4);
	curriedAdd(5);
	curriedAdd();

这样做有什么好处呢？假如说我们只想知道这个月花了多少钱，而中间的某一天之前花了多少我们并不想知道，我们只在乎结果，不在乎过程，上面的currying函数很好地解决了这个问题。有的人说这样做可以节省性能，我倒觉得这和性能没多大关系，或者说这样做的目的并不是为了性能，因为每次计算结果和最后一起计算结果是一样的，都是要计算一样的次数。还有一个好处就是可以复用currying函数，比如我们要多个数字相乘或者其他操作，都可以用currying函数，处理数字只需修改`fn`参数就可以。

说到柯里化就不得不说`Function.prototype.bind`这个方法了，它也实现了函数的柯里化。我们可以自己来实现一个`bind`函数：

	function bind（fn, context） {
	  var args = [].slice.call(arguments, 2);
	  return function () {
	    return fn.apply(context, args.concat([].slice.call(arguments)));
	  }
	}

假如我们需要改变fn中的this上下文，就可以用bind函数，否则可以用currying函数。    




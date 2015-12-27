title: "babel无法编译？"
date: "2015-11-18"
categories: "ES6"
tags: [" babel", "babel-cli", "babel-core", "babel-node"]
---

`ECMAScript 6(ES6)`的发展或者说普及之快可以说是难以想象的，对很多人来说`ECMAScript 5(ES5)`都还普及呢。现代浏览器对`ES6`新特新或多或少的有些支持，但支持度不高，所以要想在浏览器中直接使用`ES6`的新特性，还得等上一段时间。
<!--more-->
对`ES6`的普及起到至关重要的就不得不说`babel`了。`babel`可以将`ES6`代码完美地转换为`ES5`代码，所以我们不用等到浏览器的支持就可以在项目中使用`ES6`的特性。

对于刚开始使用`babel`的人，可能会碰到一些问题，因为网上对于`babel`的使用教程基本上是针对`babel 6`之前的版本，而`babel 6`对于之前版本有一些变化。

- 因为之前版本只要安装一个`babel`就可以用了，所以之前的版本包含了一大堆的东西，这也导致了下载一堆不必要的东西。所以`babel 6`拆分成两个包：`babel-cli`和`babel-core`。如果你想要在CLI(终端或REPL)使用babel就下载`babel-cli`，如果想要在node中使用就下载`babel-core`。

- `babel 6`已结尽可能的模块化了，如果还用`babel 6`之前的方法转换`ES6`，它会原样输出，并不会转化，因为需要安装插件。如果你想使用箭头函数，那就得安装箭头函数插件`npm install babel-plugin-transform-es2015-arrow-functions`。


下面来实践下(命令行使用babel)。

### 安装babel:
		
	npm install -g babel

命令行转化js文件：

	babel es6.js

提示：
		
	The CLI has been moved into the package `babel-cli`.
	npm install -g babel-cli	

安装`babel-cli`：

	npm install -g babel-cli

再次转化： 

	babel es6.js

命令行输出：

	[1, 2, 3].map(x => x * x)

可以看到并没有像期望的那样转化为`ES5`，因为没有安装插件。上面使用了箭头函数，所以要安装箭头函数插件。但是这样太麻烦，如果使用了`ES6`的其他特性，还要安装其他插件，可以只下载一个插件：

	npm install babel-preset-es2015

这个插件包含了其他插件。

安装完插件后，运行：

	babel es6.js --presets es2015

输出：

	[1, 2, 3].map(function (x) {
		return x * x;
	})

上面已经得到想要的结果了。

`babel`可以将ES6文件转换输出到另一个文件：

	babel es6.js -o es5.js
	# 或者
	babel es6.js --out-file es5.js


也可以用于转换整个目录：

	babel -d lib/ src/


运行`babel-node`命令可以直接在命令行运行ES6代码:

	babel-node

	> console.log([1,2,3].map(x => x * x))
    [ 1, 4, 9 ]


也可以直接运行ES6文件。

	babel es6.js

	> [1, 2, 3].map(function (x) {
		return x * x;
	})

(完)







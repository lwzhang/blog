title: ES6对数组的扩展
date: 2014-07-13 19:57:30
categories: "ES6"
tags: ["ES6", "Array", "Array comprehensions"]
---

`ECMAScript6`对数组进行了扩展，为数组`Array`构造函数添加了`from()`、`of()`等静态方法，也为数组实例添加了`find()`、`findIndex()`等方法。下面一起来看一下这些方法的用法。

## Array.from()

`Array.from()`将类数组(array-like)对象与可遍历的对象转化为数组并返回。例如将dom节点集合转化为数组，以前我们可能都会这样写：

```
var divs = document.querySelectAll("div");
[].slice.call(divs).forEach(function (node) {
   console.log(node);
})
```

<!--more-->

现在我们可以这样写：

```
var divs = document.querySelectAll("div");
Array.from(divs).forEach(function (node) {
   console.log(node);
})
```

上面两种写法基本上是相同的。

`Array.from()`也可以将ES6中新增的`Set`、`Map`等结构转化为数组：

```
// 将Set结构转化为数组
Array.from(new Set([1, 2, 3, 4])); // [1, 2, 3, 4]
```
```
//将Map结构转化为数组
Array.from(new Map(["name", "zlw"])); // ["name", "zlw"]
```

字符串既是类数组又是可遍历的，所以`Array.from()`也可将字符串转化为数组：

```
Array.from("zlw"); // ["z", "l", "w"]
```
`Array.from()`还有两个可选参数，完整语法如下：

```
Array.from(obj, mapFn, thisArg)
```

`mapFn`其实就是数组的`map`方法，对数组的每个元素处理。`thisArg`是执行环境的上下文。`Array.from(obj, mapFn, thisArg)`等同于`Array.from(obj).map(mapFn, thisArg)`。

## Array.of()

`Array.of()`将其参数转化为数组。如：

```
Array.of(1, 2, 3); // [1, 2, 3]
```

我们知道用`Array`构造函数也可以实现同样功能：

```
Array(1, 2, 3) // [1, 2, 3]
```

他们的不同之处在于：

```
Array.of(3); // [3]

Array(3) // [undefined, undefined, undefined]
```

当传入一个参数时，`Array.of()`会返回只有一个元素的数组，而`Array()`会返回长度为传入参数而元素都为`undefined`的数组。

## Array.prototype.fill()

`fill()`方法用一个值填充数组给定开始和结束位置之间的的所有值，语法如下：

```
fill(value, start, end)
```

参数`start`、`end`是填充区间，包含`start`位置，但不包含`end`位置。如果省略，则`start`默认值为`0`，`end`默认值为数组长度。如果两个可选参数中有一个是负数，则用数组长度加上该数来确定相应的位置。例：

```
[1, 2, 3].fill(4) // [4, 4, 4]
[1, 2, 3].fill(4, 1, 2) // [1, 4, 3]
[1, 2, 3].fill(4, -3, -2) // [4, 2, 3]
```

## Array.prototype.find()与Array.prototype.findIndex()

`find()`方法返回数组中符合条件的第一个元素，如果没有则返回`undefind`。语法如下：

```
array.find(callback, context);
```

参数包括一个回调函数和一个可选参数(执行环境上下文）。回调函数会遍历数组的所有元素，直到找到符合条件的元素，然后`find()`方法返回该元素。例：

```
[1, 2, 3, 4].find(function(el, index, arr) {
   return el > 2;
}) // 3

[1, 2, 3, 4].find(function(el, index, arr) {
　　return el > 4;
}) // undefined
```

`findIndex()`方法与`find()`方法用法类似，返回的是第一个符合条件的元素的索引，如果没有则返回`-1`。例：

```
[1, 2, 3, 4].findIndex(function(el, index, arr) {
   return el > 2;
}) // 2

[1, 2, 3, 4].findIndex(function(el, index, arr) {
　　return el > 4;
}) // -1
```

## Array.prototype.entries()、Array.prototype.keys与Array.prototype.values()

`entries()`、`keys`与`values`都返回一个数组迭代器对象。例：

```
var entries = [1, 2, 3].entries();
console.log(entries.next().value); // [0, 1]
console.log(entries.next().value); // [1, 2]
console.log(entries.next().value); // [2, 3]

var keys = [1, 2, 3].keys();
console.log(keys.next().value); // 0
console.log(keys.next().value); // 1
console.log(keys.next().value); // 2

var valuess = [1, 2, 3].values();
console.log(values.next().value); // 1
console.log(values.next().value); // 2
console.log(values.next().value); // 3
```

迭代器的`next()`方法返回的是一个包含`value`属性与`done`属性的对象，而`value`属性是当前遍历位置的值，`done`属性是一个布尔值，表示遍历是否结束。

我们也可以用`for...of`来遍历迭代器：

```
for (let i of entries) {
  console.log(i)
} // [0, 1]、[1, 2]、[2, 3]

for (let [index, value] of entries) {
  console.log(index, value)
} // 0 1、1 2、2 3

for (let key of keys) {
  console.log(key)
} // 0, 1, 2

for (let value of values) {
  console.log(value)
} // 1, 2, 3
```

## Array.prototype.copyWithin()

`copyWithin()`方法语法如下：

```
arr.copyWithin(target, start, end = this.length)
```
最后一个参数为可选参数，省略则为数组长度。该方法在数组内复制从`start`(包含`start`)位置到`end`(不包含`end`)位置的一组元素覆盖到以`target`为开始位置的地方。例：

```
[1, 2, 3, 4].copyWithin(0, 1) // [2, 3, 4, 4]

[1, 2, 3, 4].copyWithin(0, 1, 2) // [2, 2, 3, 4]
```

如果`start`、`end`参数是负数，则用数组长度加上该参数来确定相应的位置：

```
[1, 2, 3, 4].copyWithin(0, -2, -1) // [3, 2, 3, 4]
```

需要注意`copyWithin()`改变的是数组本身，并返回改变后的数组，而不是返回原数组的副本。

## 数组推导(array comprehensions)

数组推导就是利用`for...of`循环基于现有的数组生成新数组。例：

```
[for (i of [1, 2, 3]) i * i]  // [1, 4, 9]
```

数组推导允许使用`if`语句：

```
// 单个if语句
[for (i of [1, 2, 3]) if (i < 3) i] // [1, 2]

//多重if语句
[for (i of [1, 2, 3]) if (i < 3) if (i > 1) i] // [2]
```

需要注意的是`for...of`总是写在最前面。

数组推导也允许使用多重`for..of`循环：

```
[for (i of [1, 2, 3]) for (j of [4, 5, 6]) i * j] // [4, 5, 6, 8, 10, 12, 12, 15, 18]
```

数组推导中还可以包含数组推导：

```
[for (i of [1, 2, 3]) [for (j of [4, 5, 6]) i * j]] // [[4, 5, 6], [8, 10, 12], [12, 15, 18]]
```

各大浏览器对ES6的支持可以查看kangax.github.io/es5-compat-table/es6/。
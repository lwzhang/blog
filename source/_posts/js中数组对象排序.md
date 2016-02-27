title: js中数组对象排序
date: 2014-04-27 18:59:56
categories: "JavaScript"
tags: ["js数组排序", "sort"]
---

## 普通数组排序　　

`js`中用方法`sort()`为数组排序。`sort()`方法有一个可选参数，是用来确定元素顺序的函数。如果这个参数被省略，那么数组中的元素将按照ASCII字符顺序进行排序。如：

```
var arr = ["a", "b", "A", "B"];
arr.sort();
console.log(arr);//["A", "B", "a", "b"]
```

因为字母`A`、`B`的`ASCII`值分别为`65`、`66`，而`a`、`b`的值分别为`97`、`98`，所以上面输出的结果是`["A", "B", "a", "b"]`。

<!--more-->

如果数组元素是数字呢，结果会是怎样？

```
var arr = [15, 8, 25, 3];
arr.sort();
console.log(arr);//[15, 25, 3, 8]
```

结果是`[15, 25, 3, 8]`。其实，`sort`方法会调用每个数组项的`toString()`方法，得到字符串，然后再对得到的字符串进行排序。虽然数值`15`比`3`大，但在进行字符串比较时"15"则排在"3"前面。显然，这种结果不是我们想要的，这时，`sort()`方法的参数就起到了作用，我们把这个参数叫做比较函数。

比较函数接收两个参数，如果第一个参数应该位于第二个之前则返回一个负数，如果两个参数相等则返回0，如果第一个参数应该位于第二个之后则返回一个正数。例子：

```
var arr = [23, 9, 4, 78, 3];
var compare = function (x, y) {//比较函数
    if (x < y) {
        return -1;
    } else if (x > y) {
        return 1;
    } else {
        return 0;
    }
}
console.log(arr.sort(compare));
```

结果为`[3, 4, 9, 23, 78]`，返回了我们想要的结果。如果要按降序排序，比较函数写成这样即可：

```
var compare = function (x, y) {
    if (x < y) {
        return 1;
    } else if (x > y) {
        return -1;
    } else {
        return 0;
    }
}
```

我们并不能用比较函数比较一个不能转化为数字的字符串与数字的顺序：

```
var arr = ["b", 5];
console.log(arr.sort(compare))
```

结果是`["b", 5]`。因为比较函数在比较时，会把先把字符串转化为数字，然后再比较，字符串`b`不能转化为数字，所以就不能比较大小。然而，当不用比较函数时，会比较`ASCII`值，所以结果是`[5, "b"]`。

## 数组对象排序

如果数组项是对象，我们需要根据数组项的某个属性对数组进行排序，要怎么办呢？其实和前面的比较函数也差不多：

```
var arr = [{name: "zlw", age: 24}, {name: "wlz", age: 25}];
var compare = function (obj1, obj2) {
    var val1 = obj1.name;
    var val2 = obj2.name;
    if (val1 < val2) {
        return -1;
    } else if (val1 > val2) {
        return 1;
    } else {
        return 0;
    }
}
console.log(arr.sort(compare));
```

输出结果为`[Object { name="wlz", age=25}, Object { name="zlw", age=24}]`，可以看到数组已经按照`name`属性进行了排序。我们可以对上面的比较函数再改造一下：

```
var compare = function (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }
}
```

如果想按照`age`进行排序，`arr.sort(compare("age"))`即可。

但是对`age`属性进行排序时需要注意了，如果`age`属性的值是数字，那么排序结果会是我们想要的。但很多时候我们从服务器传回来的数据中，属性值通常是字符串。现在我把上面的数组改为：

```
var arr = [{name: "zlw", age: "24"}, {name: "wlz", age: "5"}];
```
可以看到，我把`age`属性由数字改为了字符串，第二个数组项的`age`值改为了`"5"`。再次调用`arr.sort(compare("age"))`后，结果为：

```
[Object { name="zlw", age="24"}, Object { name="wlz", age="5"}]
```

我们的期望是`5`排在`25`前面，但是结果不是。这是因为当两个数字字符串比较大小时，会比较它们的`ASCII`值大小，比较规则是：从第一个字符开始，顺次向后直到出现不同的字符为止，然后以第一个不同的字符的ASCII值确定大小。所以"24"与"5"比较大小时，先比较”2“与"5"的ASCII值，显然”2“的ASCII值比"5"小，即确定排序顺序。

现在，我们需要对比较函数再做一些修改：

```
var compare = function (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }
}
```

在比较函数中，先把比较属性值转化为数字`Number(val1)`再通过`!isNaN(Number(val1))`判断转化后的值是不是数字(有可能是`NaN`)，转化后的值如果是数字，则比较转换后的值，这样就可以得到我们想要的结果了， 调用`arr.sort(compare("age"))`得到：

```
[Object { name="wlz", age="5"}, Object { name="zlw", age="24"}]
```

可以看到，确实是按正确的方式排序了。

这篇文章所讲的都是基础的，没什么技术含量，只是最近项目中遇到了对数组对象进行排序的问题，所以在这里写出来分享一下，相信总能帮到一些朋友。

　　
title: "《数据结构与算法JavaScript描述》中的一处错误"
date: "2015-03-04"
category: "JavaScript"
tags: ["数据结构"]
---

最近在看《数据结构与算法JavaScript描述》这本书，看到选择排序这部分时，发现一个比较大的错误。
<!--more-->
原书的选择排序算法是这样的：

    function selectionSort() {
		var min, temp;
		for (var outer = 0; outer <= this.dataStore.length - 2; ++outer) {
			min = outer;
			for (var inner = outer + 1; inner <= this.dataStore.length - 1; ++inner) {
				if (this.dataStore[inner] < this.dataStore[min]) {
					min = inner;
				}
				swap(this.dataStore, outer, min);
			}	
		}
	}

错误在于，它把swap函数放在了内循环里面了，其实swap函数应该放在内循环外面，原理就不多说了，书上都有：

    function selectionSort() {
		var min, temp;
		for (var outer = 0; outer <= this.dataStore.length - 2; ++outer) {
			min = outer;
			for (var inner = outer + 1; inner <= this.dataStore.length - 1; ++inner) {
				if (this.dataStore[inner] < this.dataStore[min]) {
					min = inner;
				}
			}	
			swap(this.dataStore, outer, min);
		}
	}
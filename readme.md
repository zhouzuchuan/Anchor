# **Anchor**

## 简介

```
基于Jquery的一款锚链接插件
```

## 结构引用
下面结构仅供参考（主要是选择器的引用）
``` html
  <div class="box" zzc-anchor-main="1">区域一</div>
  <div class="box" zzc-anchor-main="2">区域二</div>
  <div class="box" zzc-anchor-main="3">区域三</div>
  <div class="box" zzc-anchor-main="4">区域四</div>
  <div class="box" zzc-anchor-main="5">区域五</div>
  <div  class="posBox">
      <ul>
          <li zzc-anchor-btn="1">按钮一</li>
          <li zzc-anchor-btn="2">按钮二</li>
          <li zzc-anchor-btn="3">按钮三</li>
          <li zzc-anchor-btn="4">按钮四</li>
          <li zzc-anchor-btn="5">按钮五</li>
      </ul>
  </div>
```

-------

## 接口引用
``` javascript
  var anchor = new Anchor({
    // 参数...
    
  });
```

-------


## 文档
### `baseline`
``` 参数
相对基准线的位置 即触发事件的基准线在视口区域的什么位置

top/middle/bottom/number  【屏幕顶端/屏幕中间/屏幕底端/自定义数字】 默认为 top
```
``` javascript
baseline: top
```

### `scrollAnimation`
``` 参数
点击绑定的按钮时候执行动画滚动

boolean/[speed, easing, callback]  【是否开启动画（false/true）/执行动画的参数（参考Jquery的animate参数）】默认为 true
```
``` javascript
scrollAnimation: [300, 'linear', function () {
   console.log('滚动结束！')
 }]
```

### `closeScroll`
``` 参数
关闭滚动监听

boolean  【是否关闭（false/true）】 默认为 fasle
```
``` javascript
closeScroll: true
```

### `selector`
``` 参数
指定选择器

array 【['按钮的选择器', '区块的选择器']】 默认为 ['zzc-anchor-btn', 'zzc-anchor-main']
```
``` javascript
selector: ['baidu-btn', 'taobao-main']
```

### `currentClass`
``` 参数
选中当前添加的class类

array 【['按钮选中添加的class', '区块选中添加的class'] （若数组中只有个子项 那么class都为这个子项）】 默认为 ['', '']
```
``` javascript
selector: ['current']
```

### `currentWill`
``` 参数
选中之前执行

($currentBtn, $currentMain) 【即将进入的按钮（Jqyery对象）， 即将进入的区域（Jqyery对象）】
```
``` javascript
currentWill: function ($currentBtn, $currentMain) {
  console.log('马上到达', $currentBtn, '和', $currentMain)
}
```

### `currentDid`
``` 参数
离开之后执行

($leaveBtn, $leaveMain) 【即将离开的按钮（Jqyery对象）， 即将离开的区域（Jqyery对象）】 
```
``` javascript
currentDid: function ($leaveBtn, $leaveMain) {
  console.log('马上离开', $leaveBtn, '和', $leaveMain)
}
```

### `outArea`
``` 参数
页面视口离开绑定的选择器区域执行

```
``` javascript
outArea: function () {
  console.log('您已经离开监视区域了！')
}
```

### `scrollDelay`
``` 参数
滚轮滚动延迟执行的时间

默认为 300  （不是特别需要 则不建议更改 可能会出现未知的问题）

```





-------





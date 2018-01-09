# 瀑布流布局-新浪新闻

[预览DEMO地址](https://maxyandd.github.io/waterfall-sinanews/index.html)

## 懒加载原理

通过JS控制img标签src属性，实现控制img加载时机。加载时机可以是图片进入可视区域，或者滚动到某个位置。一般我们将img的最初的src定义为一个很小的图片，真图片的src放到自定义属性中，当触发加载时，通过JS修改img的src为真正的图片地址，实现懒加载。

[demo](http://js.jirengu.com/tefac)

## 瀑布流布局原理

瀑布布局是将宽度相等，高度不一的元素，布局到各列中，通过对元素定位，每次定位的位置是各列中最短的，实现类似瀑布一样的效果。一般通过JS改变top和left值来进行绝对定位实现。首先新建一个数组来保存各列的高度，每次放置时，选择出最短的一列，通过该列的高度和数组的index值，可以计算出元素放置的位置。插入完成后将之前最短列的高度加上刚刚放置元素的高度，更新数组。

[demo](https://maxyandd.github.io/web-preview/%E7%80%91%E5%B8%83%E6%B5%81%E5%B8%83%E5%B1%80%E5%AE%9E%E7%8E%B0/index.html)

## 实现原理



1. 调用$.ajax使用jsonp方式获取数据

```
function getDate(callback){
  $.ajax({
    url: 'http://platform.sina.com.cn/slide/album_tech',
    dataType: 'jsonp',
    jsonp: 'jsoncallback',
    data: {
      app_key: '1271687855',
      num: listNum,
      page: startPage
    }
  }).done(function(ret){
    if(ret && ret.status && ret.status.code === "0"){
      callback(ret.data);   //如果数据没问题，那么生成节点并摆放好位置
    }else{
      console.log('get error data');
    }
  })
}
```
2. 将获取的数据append到html文档中
```
function render(data){
  console.log(data);
  var tempDom =''

  $node = $(tempDom);
  data.forEach(function(item){
    var tempDom =''

    tempDom += '<li>';
    tempDom += '<div class="wt-cell">';
    tempDom += '<a href="' + item.url + '"><img src="' + item.img_url + '" alt=""></a>';
    tempDom += '<h3>' + item.short_name + '</h3>';
    tempDom += '<p>' + item.short_intro + '</p>';
    tempDom += '</div>';
    tempDom += '</li>';

    $('.waterfall-container ul').append($(tempDom));
    startPage++;
  })
}

```

3. 实现瀑布流

```
function waterFall(){
  var cellWidth = 300;
  var ctWidth = $('.waterfall-container ul').width();
  var colsHeight = [];
  var colsNum = Math.floor(ctWidth/cellWidth);
  for(var i = 0; i < colsNum; i++){
    colsHeight[i] = 0;
    }
  var minHeight = 0;
  var minIndex = 0;


  $('li').each(function(){
    for(var i = 0; i < colsHeight.length; i++){
      if (colsHeight[i] < minHeight){
        minHeight = colsHeight[i];
        minIndex = i;
      }
    }
    $(this).css({
      'top': minHeight + 'px',
      'left': cellWidth*minIndex + 'px',
      'opacity': 1
    })
    $(this).attr('loadStatus', 1)
    colsHeight[minIndex] += $(this).outerHeight()
    minHeight = colsHeight[minIndex];
    
  })
}
```
4. 绑定srcoll事件，动态获取数据
```
$(window).scroll(function(){
  if($(document).scrollTop() + $(window).height()  == $(document).height()){
    init()
  }
})

// 初始化
function init(){
  getDate(function(data){
    render(data);
    // waterFall();
    $('.wt-cell img').load(function(){  //每张图片加载时，都进行一次布局
      waterFall()
    })
  })
}
```
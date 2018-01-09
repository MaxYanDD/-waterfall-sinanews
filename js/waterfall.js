var listNum = 12 ;
var startPage = 0;

init();
// scroll事件绑定
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

// ajax获取数据函数
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


// DOM渲染，将生产的DOM插入ul中
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


// 瀑布流布局
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


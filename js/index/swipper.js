import $ from "../jquery.min.js";

var index = 0;
var timer = null;
autoPlay();
function autoPlay() {
  timer = setInterval(function () {
    index++;
    if (index == 5) {
      index = 0;
    }
    $(".swipper img").eq(index).fadeIn(500).siblings().fadeOut(500);
    $(".swipper-nav li")
      .eq(index)
      .addClass("active")
      .siblings()
      .removeClass("active");
  }, 2000);
}

//点击上翻页
$(".prev").click(function () {
  clearInterval(timer);
  index--;
  if (index == -1) {
    index = 4;
  }
  $(".swipper img").eq(index).fadeIn(500).siblings().fadeOut(500);
  $(".swipper-nav li")
    .eq(index)
    .addClass("active")
    .siblings()
    .removeClass("active");
});
//点击下翻页
$(".next").click(function () {
  clearInterval(timer);
  index++;
  if (index == 5) {
    index = 0;
  }
  $(".swipper img").eq(index).fadeIn(500).siblings().fadeOut(500);
  $(".swipper-nav li")
    .eq(index)
    .addClass("active")
    .siblings()
    .removeClass("active");
});
//离开轮播图启动定时器
$(".swipper").hover(
  function () {
    clearInterval(timer);
  },
  function () {
    autoPlay();
  }
);
//点击小圆点跳转轮播图
$(".swipper-nav li").click(function () {
  index = $(this).index();
  $(this).addClass("active").siblings().removeClass("active");
  $(".swipper img").eq(index).fadeIn(500).siblings().fadeOut(500);
});

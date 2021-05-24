import $ from "../jquery.min.js";
//第一秒渲染
var end = new Date("2021-5-17 22:00:00");
var now = new Date();
var gap = end - now;
var h = parseInt(gap / (1000 * 60 * 60));
var m = parseInt(gap / (1000 * 60)) % 60;
var s = parseInt(gap / 1000) % 60;
$(".countdown").html(
  `<span>${h}</span><i>:</i><span>${m}</span><i>:</i><span>${s}</span>`
);
if (h < 10) {
  h = "0" + h;
}
if (m < 10) {
  m = "0" + m;
}
if (s < 10) {
  s = "0" + s;
}
$(".countdown").html(
  `<span>${h}</span><i>:</i><span>${m}</span><i>:</i><span>${s}</span>`
);
//倒计时
setInterval(function () {
  end = new Date("2021-5-17 22:00:00");
  now = new Date();
  gap = end - now;
  h = parseInt(gap / (1000 * 60 * 60));
  m = parseInt(gap / (1000 * 60)) % 60;
  s = parseInt(gap / 1000) % 60;
  if (h < 10) {
    h = "0" + h;
  }
  if (m < 10) {
    m = "0" + m;
  }
  if (s < 10) {
    s = "0" + s;
  }
  $(".countdown").html(
    `<span>${h}</span><i>:</i><span>${m}</span><i>:</i><span>${s}</span>`
  );
}, 1000);

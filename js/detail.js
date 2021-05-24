import $ from "./jquery.min.js";
//渲染商品详情信息
initData();
async function initData() {
  let search = window.location.search;
  let id = search.split("=")[1]; //取id
  let list = await $.ajax({
    type: "get",
    url: "http://1.117.85.143:5566/list",
    data: {
      id,
    },
    dataType: "json",
  });
  console.log(list);
  if (list.length) {
    let goodinfo = list[0]; //list[0]取对象,请求ajax得到本页商品的信息
    let { id, name, desc, price, img } = goodinfo;
    //更新最上面的商品名
    $(".topbar>span:first").html(name);
    //更新详情内容
    $(".goodsName").html(name);
    $(".goodsDesc").html(desc);
    $(".bigPrice").html(price);
    //缓存商品信息
    $(".addIn").data("goodsId", id);
    $(".addIn").data("goodsName", name);
    $(".addIn").data("goodsDesc", desc);
    $(".addIn").data("goodsPrice", price);
    $(".addIn").data("goodsImg", img);
    $(".addIn").data("goodsNum", 1);
  }

  //获取轮播图 图片
  getSwipper();
  async function getSwipper() {
    let list = await $.ajax({
      type: "get",
      url: "http://1.117.85.143:5566/list",
      dataType: "json",
    });
    list[id - 1].swipperImg.forEach(function (item, i) {
      $(".swipper img").eq(i).attr("src", item);
    });
  }
  total();
}

///////////////////////////////////购物车板块///////////////////////////////
//点击加入购物车
$(".addIn").click(async function () {
  let userinfo = JSON.parse(localStorage.getItem("user_logged"));
  //判断是否登录，已登录就加入购物车，未登录就返回Login.html
  if (userinfo) {
    let userid = userinfo[0].id; //用户编号
    //向此用户的数据库里写入商品信息
    let goodsid = $(this).data("goodsId");
    let goodsname = $(this).data("goodsName");
    let goodsprice = $(this).data("goodsPrice");
    let goodsnum = $(this).data("goodsNum");
    let goodsimg = $(this).data("goodsImg");
    console.log(goodsimg);

    let service_imgs = {};
    let service_titles = {};
    let service_prices = {};
    let service_nums = {};
    let selectedlist = document.querySelectorAll(".left input");
    selectedlist.forEach(function (item, i) {
      if (item.checked) {
        service_imgs[`${i}`] = $(".addIn").data(`service_${i}_img`);
        service_titles[`${i}`] = $(".addIn").data(`service_${i}_title`);
        service_prices[`${i}`] = $(".addIn").data(`service_${i}_price`);
        service_nums[`${i}`] = 1;
      }
    });

    let list = await $.ajax({
      type: "get",
      url: "http://1.117.85.143:5566/myshoppingcar",
      dataType: "json",
      data: {
        userid,
        goodsid,
      },
    });

    //先判断此人是否买过此商品
    if (list.length) {
      let id = list[0].id; //购物车的数据的编号
      let existnum = list[0].goodsnum * 1; //已经存在
      let result = await $.ajax({
        type: "patch",
        url: "http://1.117.85.143:5566/myshoppingcar/" + id,
        dataType: "json",
        data: {
          goodsnum: existnum + goodsnum,
        },
      });
    } else {
      let result = await $.ajax({
        type: "post",
        url: "http://1.117.85.143:5566/myshoppingcar",
        dataType: "json",
        data: {
          userid,
          goodsid,
          goodsname,
          goodsprice,
          goodsimg,
          goodsnum,

          service_imgs,
          service_prices,
          service_titles,
          service_nums,
        },
      });
    }

    location.href = "shoppingCar.html";
  } else {
    alert("请先登录");
    window.localStorage.setItem("backurl", window.location.href);
    window.location.href = "login.html";
  }
});

//计算小计
async function total() {
  ////更新已选择的服务列表
  let list = document.querySelectorAll(".left input");
  let goodsName = document.querySelector(".product .goodsName").innerHTML;
  let bigPrice = document.querySelector(".product .bigPrice").innerHTML;
  console.log(bigPrice, goodsName);
  //渲染商品信息(电视的名称和价钱)
  let html = `
                    <li>
                        <span>${goodsName}</span>
                        <span>${bigPrice}</span>
                    </li>
  `;
  //判断,如果选中增值服务,就把增值服务渲染进小计
  list.forEach(function (item, i) {
    if (item.checked) {
      let title =
        item.parentNode.parentNode.querySelector(".right h4 span").innerHTML;
      let price =
        item.parentNode.parentNode.querySelector(".right p span").innerHTML;

      //item是Input单选框,img就是input的兄弟
      let img = $(item).siblings().attr("src");
      //将每一项选中的服务绑定到addIn上。
      $(".addIn").data(`service_${i}_img`, img);
      $(".addIn").data(`service_${i}_title`, title);
      $(".addIn").data(`service_${i}_price`, price);
      //更新加上增值服务之后的的商品和价钱
      html += `
      <li>
            <span>${title}</span> 
            <span>${price}</span>
      </li>`;
    }
  });
  document.querySelector(".total > ul").innerHTML = html;

  ////////更新价格总计////////
  let count = 0;
  $(".total ul li")
    .find("span:last")
    .each(function (i, item) {
      count += parseInt($(item).html());
    });

  $(".total div span:last").html(count + "元");
}

//单选和反选,添加商品  mousedown
$(".service > div").on("mousedown", function () {
  $(this)
    .find("input:radio")
    .data("previousValue", $(this).find("input:radio").prop("checked"));
});

//单选反选，添加商品 onclick
$(".service > div").on("click", function () {
  if ($(this).find("input:radio").data("previousValue")) {
    //如果之前已被选中，则点击之后取消选中,并且删除商品。
    $(this).find("input:radio").prop("checked", false);
    var html = document.createElement("li");
    let title = $(this).find(".right h4 span:first").html();
    let price = $(this).find(".right p span").html();
    html.innerHTML = `<span>${title}</span>
            <span>${price}</span>`;
  } else {
    //如果之前未被选中，则点击之后选中，并且添加商品。
    $(this).find("input:radio").prop("checked", true);
  }

  $(this).toggleClass("active1").siblings().removeClass("active1");
  $(this).siblings().find(".right h4 span:first").removeClass("active2");
  $(this).find(".right h4 span:first").toggleClass("active2");
  total();
});

////////////////////////////////////////////轮播图部分///////////////////////////////////////////////////////////////////////
//自动播放
var index = 0;
var timer = null;
//自动播放
autoPlay();
function autoPlay() {
  timer = setInterval(function () {
    index++;
    if (index == 4) {
      index = 0;
    }
    $(".swipper img").eq(index).fadeIn(500).siblings().fadeOut(500);
    $(".nav li").eq(index).addClass("active").siblings().removeClass("active");
  }, 2000);
}

//点击上翻页
$(".prev").click(function () {
  clearInterval(timer);
  index--;
  if (index == -1) {
    index = 3;
  }
  $(".swipper img").eq(index).fadeIn(500).siblings().fadeOut(500);
  $(".nav li").eq(index).addClass("active").siblings().removeClass("active");
});
//点击下翻页
$(".next").click(function () {
  clearInterval(timer);
  index++;
  if (index == 4) {
    index = 0;
  }
  $(".swipper img").eq(index).fadeIn(500).siblings().fadeOut(500);
  $(".nav li").eq(index).addClass("active").siblings().removeClass("active");
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
$(".nav li").click(function () {
  index = $(this).index();
  $(this).addClass("active").siblings().removeClass("active");
  $(".swipper img").eq(index).fadeIn(500).siblings().fadeOut(500);
});

////////////////////////////////////给banner图加高度//////////////////////////////
$(".img-box img").each(function (i, item) {
  let imgBoxHeight = $(item).css("height");
  $(item)
    .parent()
    .css({ height: `${imgBoxHeight}` });
});

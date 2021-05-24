import $ from "./jquery.min.js";
//如果已登录,就显示用户名
let userinfo = JSON.parse(window.localStorage.getItem("user_logged"));
if (userinfo) {
  let userid = userinfo[0].id;
  $(".logged").show().html(`
  ${userinfo[0].username}
                        <div class="logged-out" style="display: none;">
                            退出
                        </div>
  `);
  $(".no_logged").hide();
  getShopList();
  async function getShopList() {
    let list = await $.ajax({
      type: "get",
      url: "http://1.117.85.143:5566/myshoppingcar?userid=" + userid,
      dataType: "json",
    });
    if (list.length) {
      $(".cart-full").removeClass("hide");
      $(".cart-empty").addClass("hide");
      let count = 0;
      let totalPrice = 0;
      //item是每一种商品{}形式
      let html_cart = "";
      list.forEach(function (item) {
        count += item.goodsnum * 1;
        //渲染购物车列表的内容
        let { goodsname, goodsprice, goodsimg, goodsnum } = item;
        totalPrice += goodsprice * goodsnum;
        html_cart += `
        <div class="cart-list clear">
            <img src="${goodsimg}" alt="">
            <span class="desc">${goodsname}</span>
            <span class="price">${goodsprice} X ${goodsnum}</span>
        </div>

`;
      });
      $(".cart-num").html(`(${count})`);
      html_cart += `
     <div class="cart-total">
         <div class="cart-total-left">
             <span class="count">共 ${count} 件商品</span>
             <span class="price">${totalPrice}<span>元</span> </span>
         </div>
         <a href="shoppingCar.html" type="button">去购物车结算</a>
     </div>`;
      $(".cart-menu").html(html_cart);

      //如果购物车有数据,就把购物车列表拉下来
      $(".topbar-cart").hover(
        function () {
          $(".cart-menu").slideDown(200);
        },
        function () {
          $(".cart-menu").slideUp(200);
        }
      );
    } else {
      //如果已登录,但是购物车没有数据,显示空购物车图标,把空面板拉下来
      $(".cart-full").addClass("hide");
      $(".cart-empty").removeClass("hide");
      $(".topbar-cart").hover(
        function () {
          $(".cart-empty-menu").slideDown(300);
          console.log(11);
        },
        function () {
          $(".cart-empty-menu").slideUp(300);
        }
      );
    }
  }
  $(".no_logged").hide();
  $(".logged").show();
} else {
  //如果未登录,就显示登录和注册
  $(".no_logged").show();
  $(".logged").hide();

  //未登录,放到购物车hover出空面板
  $(".topbar-cart").hover(
    function () {
      $(".cart-empty-menu").slideDown(300);
      console.log(11);
    },
    function () {
      $(".cart-empty-menu").slideUp(300);
    }
  );
}
//登录
$(".logged").hover(
  function () {
    $(".logged-out").slideDown(200);
  },
  function () {
    $(".logged-out").slideUp(200);
  }
);
//退出
$(".logged-out").click(function () {
  confirm("确定要退出吗?");
  if (confirm) {
    localStorage.removeItem("user_logged");
    window.location.href = "index.html";
  }
});

//关键字查询
let key = "";
let _sort = "id";
let _order = "asc";
let cuxiao = "";
let fenqi = "";
let youhuo = "";
let _page = 1;
let totalPage = 0;
//关键字查询
$(".key").click(function () {
  key = $(this).prev().val();
  console.log(key);
  location = "list.html";
  _page = 1;
  console.log(key);
  getList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
});

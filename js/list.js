import $ from "./jquery.min.js";
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
  _page = 1;
  $(`.page-nav span:nth-of-type(${_page})`)
    .addClass("active")
    .siblings()
    .removeClass("active");
  getList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
});
//综合排序
$(".compre").click(function () {
  _sort = "id";
  _order = "asc";
  _page = 1;
  $(`.page-nav span:nth-of-type(${_page})`)
    .addClass("active")
    .siblings()
    .removeClass("active");
  $(this).addClass("active").siblings().removeClass("active");
  getList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
});
//销量降序
$(".sold").click(function () {
  _sort = "sold";
  _order = $(this).attr("data-order");
  _page = 1;
  $(`.page-nav span:nth-of-type(${_page})`)
    .addClass("active")
    .siblings()
    .removeClass("active");
  $(this).addClass("active").siblings().removeClass("active");
  getList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
});
//价格升序
$(".priceAsc").click(function () {
  _sort = "price";
  _order = $(this).attr("data-order");
  _page = 1;
  $(`.page-nav span:nth-of-type(${_page})`)
    .addClass("active")
    .siblings()
    .removeClass("active");
  $(this).addClass("active").siblings().removeClass("active");
  getList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
});
//价格降序
$(".priceDesc").click(function () {
  _sort = "price";
  _order = $(this).attr("data-order");
  _page = 1;
  $(`.page-nav span:nth-of-type(${_page})`)
    .addClass("active")
    .siblings()
    .removeClass("active");
  $(this).addClass("active").siblings().removeClass("active");
  getList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
});
//查询促销
$('input[name="cuxiao"]').click(function () {
  //如果框子被选中,证明要渲染出促销的商品
  if ($(this).prop("checked")) {
    cuxiao = "1";
    _page = 1;
    $(`.page-nav span:nth-of-type(${_page})`)
      .addClass("active")
      .siblings()
      .removeClass("active");
    getList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
  } else {
    //没被选中就渲染所有的商品
    cuxiao = "";
    _page = 1;
    $(`.page-nav span:nth-of-type(${_page})`)
      .addClass("active")
      .siblings()
      .removeClass("active");
    getList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
  }

  //先查询促销的商品一共有几页
  getToalList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
  console.log(cuxiao);
});
//查询分期
$('input[name="fenqi"]').click(function () {
  //如果框子被选中,证明要渲染出促销的商品
  if ($(this).prop("checked")) {
    fenqi = "1";
    _page = 1;
    $(`.page-nav span:nth-of-type(${_page})`)
      .addClass("active")
      .siblings()
      .removeClass("active");
    getList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
  } else {
    fenqi = "";
    _page = 1;
    $(`.page-nav span:nth-of-type(${_page})`)
      .addClass("active")
      .siblings()
      .removeClass("active");
    getList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
  }
  //先查询分期的商品一共有几页
  getToalList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
});
//查询有货
$('input[name="youhuo"]').click(function () {
  //如果框子被选中,证明要渲染出促销的商品
  if ($(this).prop("checked")) {
    youhuo = "1";
    _page = 1;
    $(`.page-nav span:nth-of-type(${_page})`)
      .addClass("active")
      .siblings()
      .removeClass("active");
    getList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
  } else {
    youhuo = "";
    _page = 1;
    $(`.page-nav span:nth-of-type(${_page})`)
      .addClass("active")
      .siblings()
      .removeClass("active");
    getList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
  }
  //先查询有货的商品一共有几页
  getToalList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
});

//点击下一页列表
$(document).on("click", ".next-page", function () {
  _page++;
  console.log(totalPage);
  if (_page >= totalPage) {
    _page = totalPage;
    console.log("_page=totalpage");
  }
  console.log(_page);
  $(`.page-nav span:nth-of-type(${_page})`)
    .addClass("active")
    .siblings()
    .removeClass("active");
  getList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
});
//点击上一页列表
$(document).on("click", ".prev-page", function () {
  _page--;
  if (_page <= 1) {
    _page = 1;
  }
  $(`.page-nav span:nth-of-type(${_page})`)
    .addClass("active")
    .siblings()
    .removeClass("active");
  getList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
});
//跳点击的页码
$(document).on("click", ".page-nav span", function () {
  let index = $(this).index();
  _page = index;
  $(`.page-nav span:nth-of-type(${_page})`)
    .addClass("active")
    .siblings()
    .removeClass("active");
  getList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
});

//获取列表所有的数据 , 判断分几页 ,并执行pageFn,渲染底部页数
getToalList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
async function getToalList(key, _sort, _order, _page, cuxiao, fenqi, youhuo) {
  let data = {};
  if (cuxiao) {
    data.cuxiao = cuxiao;
  }
  if (fenqi) {
    data.fenqi = fenqi;
  }
  if (youhuo) {
    data.youhuo = youhuo;
  }
  let totalList = await $.ajax({
    type: "get",
    url: "http://1.117.85.143:5566/list?q=" + key,
    dataType: "json",
    data,
  });
  console.log(data);
  console.log(totalList);
  totalPage = Math.ceil(totalList.length / 9); //页面显示的商品数量应该是不变的,写死即可
  pageFn();
}

//渲染底部页数
function pageFn() {
  let htmlInner = ``;
  for (let i = 1; i <= totalPage; i++) {
    if (i == 1) {
      htmlInner += `<span class="active">${i}</span>`;
    } else {
      htmlInner += `<span>${i}</span>`;
    }
  }
  let htmlOuter = `
   <em class="prev-page">⬅</em>
     ${htmlInner}
   <em class="next-page">➡</em>
   `;
  $(".page-nav").html(htmlOuter);
}

//渲染列表  每次只能获取9条数据
getList(key, _sort, _order, _page, cuxiao, fenqi, youhuo);
async function getList(key, _sort, _order, _page, cuxiao, fenqi, youhuo) {
  let data = {
    _sort,
    _order,
    _limit: 9, //每页显示两条数据
    _page,
  };
  if (cuxiao) {
    data.cuxiao = cuxiao;
  }
  if (fenqi) {
    data.fenqi = fenqi;
  }
  if (youhuo) {
    data.youhuo = youhuo;
  }
  let list = await $.ajax({
    type: "get",
    url: "http://1.117.85.143:5566/list?q=" + key,
    dataType: "json",
    data,
  });

  let html = ``;
  list.forEach(function (item) {
    let { id, img, name, price, sold, youhuo, fenqi, cuxiao } = item;
    if (youhuo == 1) {
      youhuo = "有货";
    } else {
      youhuo = "无货";
    }
    if (fenqi == 1) {
      fenqi = "分期";
    } else {
      fenqi = "不分期";
    }
    if (cuxiao == 1) {
      cuxiao = "促销";
    } else {
      cuxiao = "不促销";
    }
    html += `
    <li data-id=${id}>
    <img src="${img}" alt="">
    <h3>${name}</h3>
    <p>${price}元</p>
    <p>月销${sold}件</p>
    <p> <span class="youhup">${youhuo}</span> <span class="cuxiao">${cuxiao}</span> <span class="fenqi">${fenqi}</span>
    </p>
    </li>
      `;
  });
  $(".goods-list-ul").html(html);
}
//点击商品跳详情,把id带过去
$(document).on("click", ".goods-list-ul li", function () {
  let id = $(this).attr("data-id");
  console.log(id);
  window.location.href = "detail.html?id=" + id;
});

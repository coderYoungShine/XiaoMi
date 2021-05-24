import $ from "../js/jquery.min.js";
import $cookie from "../js/cookie.js";

///////////////////购物车初始化数据///////////////
initData();
async function initData() {
  let user_logged = JSON.parse(window.localStorage.getItem("user_logged"));
  if (user_logged) {
    let userid = user_logged[0].id; // userid=3 , username = jack
    let list = await $.ajax({
      type: "get",
      url: "http://1.117.85.143:5566/myshoppingcar",
      dataType: "json",
      data: { userid },
    });
    console.log(list);

    let html = "";

    list.forEach(function (item, i) {
      let { goodsid, goodsname, goodsprice, goodsnum, goodsimg, id } = item;
      ///////渲染用户购物车里的商品/////////
      html += `
      <li>
      <div class="addGoods-box">
          <div class="addGoods">
              <div>
                  <div class="select" id="selectOne"></div>
              </div>
              <div><img src="${goodsimg}" alt=""></div>
              <div>
                ${goodsname}</div>
              <div>${goodsprice}</div>
              <div>
                  <div class="itemNum clear">
                      <div class="reduce" data-id="${id}" data-num="${goodsnum}" data-price="${goodsprice}">-</div>
                      <input type="text" class="subNum" value="${goodsnum}" data-price=${goodsprice}>
                      <div class="add" data-id="${id}" data-num="${goodsnum}" data-price="${goodsprice}">+</div>
                  </div>

              </div>
              <div data-id="${id}" data-num="${goodsnum}" data-price="${goodsprice}">${
        goodsprice * goodsnum
      }</div>
              <div data-id="${id}" data-num="${goodsnum}" data-price="${goodsprice}" class="delete">×</div>
          </div>
      </div>
      
  </li>
      `;
    });
    $(".container-middle ul").html(html);

    total();
  } else {
    window.localStorage.setItem("backurl", window.location.href);
    window.location.href = "login.html";
  }
}

/////////////////点击结算进入结算页面///////////
let arr = []; //用来存储被选中的商品的购物车id
$(".buyNow").click(function () {
  $(".select").each(function (index, item) {
    if (item.innerHTML) {
      let id = $(item).parent().parent().find(".reduce").attr("data-id");
      arr.push(id);
    }
  });
  $cookie("selectedGoods", JSON.stringify(arr));
  console.log(JSON.parse($cookie("selectedGoods")));
  location.href = "../address.html";
});

///////////////////点击添加,减少商品//////////////

///on给未来事件绑定
$(document).on("click", ".add", async function () {
  let id = $(this).attr("data-id");
  let goodsnum = $(this).attr("data-num");
  let goodsprice = $(this).attr("data-price");
  goodsnum++;
  //更新输入框的数量
  $(this).prev().val(goodsnum);
  //更新加号的 data-num属性
  $(this).attr("data-num", goodsnum);
  //更新减号的 data-num属性 ,减号出现
  $(this).prev().prev().show().attr("data-num", goodsnum);
  //更新 小计价格
  $(this)
    .parent()
    .parent()
    .next()
    .html(goodsprice * goodsnum);
  //数据库里更新goodsNum
  let result = await $.ajax({
    type: "patch",
    url: "http://1.117.85.143:5566/myshoppingcar/" + id,
    data: {
      goodsnum,
    },
    dataType: "json",
  });
  total();
});

//减少商品
$(document).on("click", ".reduce", async function () {
  let id = $(this).attr("data-id");
  let goodsnum = $(this).attr("data-num");
  let goodsprice = $(this).attr("data-price");
  goodsnum--;
  if (goodsnum == 0) {
    goodsnum = 1;
    alert("商品数量不能小于1");
  }
  //更新输入框的数量
  $(this).next().val(goodsnum);
  //更新减号的 data-num属性
  $(this).attr("data-num", goodsnum);
  //更新加号的 data-num属性 ,减号出现
  $(this).next().next().attr("data-num", goodsnum);
  //更新 小计价格
  $(this)
    .parent()
    .parent()
    .next()
    .html(goodsprice * goodsnum);
  //数据库里更新goodsNum
  let result = await $.ajax({
    type: "patch",
    url: "http://1.117.85.143:5566/myshoppingcar/" + id,
    data: {
      goodsnum,
    },
    dataType: "json",
  });
  total();
});

////////////////////全选//////////////////////
$("#selectAll")
  .find("div")
  .on("click", function () {
    //改变全选框样式
    if ($(this).html()) {
      $(this).html("");
      $(this).css({ backgroundColor: "#fff" });
      $(".select").html("");
      $(".select").css({ backgroundColor: "#fff" });
    } else {
      $(this).html(`✔`).css({ color: "#fff", backgroundColor: "#ff6a00" });
      $(".select").html(`✔`).css({ color: "#fff", backgroundColor: "#ff6a00" });
    }
    total();
  });
//////////////////单选//////////////////////
$(document).on("click", ".select", function () {
  if ($(this).html()) {
    $(this).html("");
    $(this).css({ backgroundColor: "#fff" });
  } else {
    $(this).html(`✔`).css({ color: "#fff", backgroundColor: "#ff6a00" });
  }

  let selectOneList = document.querySelectorAll(".select");
  let selectFlag = true;
  selectOneList.forEach(function (item) {
    //如果有一个没被选中,那么就不全选
    if (!item.innerHTML) {
      selectFlag = false;
    }
  });
  if (selectFlag) {
    $("#selectAll")
      .find("div")
      .html(`✔`)
      .css({ color: "#fff", backgroundColor: "#ff6a00" });
  } else {
    $("#selectAll").find("div").html(``).css({ backgroundColor: "#ffffff" });
  }

  total();
});
//////////////////合计函数/////////////////
function total() {
  let totalNum = 0;
  let selNum = 0;
  let totalMoney = 0;

  $(".subNum").each(function (index, item) {
    totalNum += $(item).val() * 1;
  });

  $(".select").each(function (index, item) {
    if ($(item).html()) {
      selNum += $(item).parent().parent().find(".subNum").val() * 1;
      totalMoney +=
        $(item).parent().parent().find(".subNum").val() *
        $(item).parent().parent().find(".subNum").attr("data-price");
    }
    console.log(totalMoney);
  });
  $(".total_num").html(totalNum);
  $(".sel_num").html(selNum);
  $(".total_money").html(totalMoney);
}
//////////////////点击删除///////////////////
$(document).on("click", ".delete", async function () {
  console.log($(this));
  $(this).parent().parent().parent().remove();
  total();
  //更新数据库

  let id = $(this).attr("data-id");
  let result = await $.ajax({
    type: "delete",
    url: "http://1.117.85.143:5566/myshoppingcar/" + id,
    data: id,
    dataType: "json",
  });
});
///////////////////如果登录,头部显示用户名///////////
if (localStorage.getItem("user_logged")) {
  let userLoggedName = JSON.parse(localStorage.getItem("user_logged"))[0]
    .username;
  $(".header .user_logged").html("你好! " + userLoggedName);
}

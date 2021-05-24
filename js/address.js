import $cookie from "./cookie.js";
import $ from "./jquery.min.js";

//把用户名渲染进顶部
// let userid = JSON.parse(localStorage.getItem("user_logged"))[0].id;
let username = JSON.parse(localStorage.getItem("user_logged"))[0].username;
$(".username").html(`
                    ${username}
                    <div class="logged-out" style="display: none;">
                        退出
                    </div>
`);

//初始化数据
let ids = JSON.parse($cookie("selectedGoods"));

let totalCountFinal = 0;
let totalPriceFinal = 0;
let htmlFinal = "";
initData();
async function initData() {
  //每一个单独的商品 分别进行渲染
  for (let i = 0; i < ids.length; i++) {
    let id = ids[i];
    console.log(id);
    let list = await $.ajax({
      type: "get",
      dataType: "json",
      url: "http://1.117.85.143:5566/myshoppingcar",
      data: { id },
    });
    console.log(list); //list每次就只有一条
    let html = ``;

    let { goodsname, goodsprice, goodsnum, goodsimg } = list[0];
    html += `

                  <div>
                      <img src="${goodsimg}" alt="">
                      <span class="goodsname">${goodsname}</span>
                      <span class="goodsprice">
                          <span> ${goodsprice} </span>
                          X
                          <span> ${goodsnum} </span>
                      </span>
                      <span class="subtotal">${goodsprice * goodsnum}元</span>
                  </div>
      `;

    htmlFinal += html;
    totalCountFinal += goodsnum * 1;
    totalPriceFinal += goodsprice * 1;
  }

  //渲染单个商品
  $(".goodsection").html(`
    <p>商品及优惠券</p>
    ${htmlFinal}
    `);

  //渲染总计
  $(".totalCount").html(totalCountFinal);
  $(".totalPrice").html(totalPriceFinal);
  $(".finalPrice").html(totalPriceFinal);

  //初始化地址
  // let addList = await $.ajax({
  //   type: "get",
  //   dataType: "json",
  //   url: "http://1.117.85.143:5566/address",
  // });
  // $(addList).each(function (index, item) {
  //   let { name, tag, tel, ssq, detail, id } = item;
  //   let li = document.createElement("li");
  //   $(li).html(
  //     `
  //                         <div class="addressDiv" data-id=${id}>
  //                             <div class="clear">
  //                                 <span>${name}</span>
  //                                 <span>${tag}</span>
  //                             </div>
  //                             <div>${tel}</div>
  //                             <div>
  //                                 <p>${ssq}</p>
  //                                 <p>${detail}</p>
  //                             </div>
  //                             <button class="del">删除</button>
  //                         </div>
  //     `
  //   );
  //   $(".addressInfo").prepend(li);
  // });
}
//点击返回购物车
$(".back").click(function () {
  location.href = "../shoppingCar.html";
});
//点击结算
$(".buy").click(function () {
  alert(`购买成功,账户余额-${totalPriceFinal}元`);
});

//点击新增地址弹出地址框
$(".addNew").click(function () {
  $(".shadow").show();
});
//点击确定判断是否合法。 如果合法，给li添加新地址
$(".confirm").click(async function () {
  let reg1 = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
  let addressName = $(".name").val();
  let reg2 =
    /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
  let addressTel = $(".tel").val();
  if (reg1.test(addressName)) {
  } else {
    alert("请输入正确的姓名");
    return;
  }

  if (reg2.test(addressTel)) {
  } else {
    alert("手机号格式不正确");
    return;
  }

  if (!$(".detailAddInput").val()) {
    alert("请输入详细地址");
    return;
  }
  $(".shadow").hide();

  //给li里面添加输入的信息
  let li = document.createElement("li");
  let name = $(".name").val();
  let tel = $(".tel").val();
  let ssq = $(".pop").val();
  let detail = $(".detailAddInput").val();
  let tag = $(".addTagInput").val();
  $(li).html(
    `
                        <div class="addressDiv clear">
                            <div class="clear">
                                <span>${name}</span>
                                <span>${tag}</span>
                            </div>
                            <div>${tel}</div>
                            <div>
                                <p>${ssq}</p>
                                <p>${detail}</p>
                            </div>
                            <button class="del">删除</button>
                        </div>
    `
  );
  $(".addressInfo").prepend(li);

  //给新添加的Li加css
  // console.log($(".addressDiv > div:eq(1)"));
  // $(".addressDiv > div:eq(1)").css({
  //   lineHeight: "22px",
  //   color: "#757575",
  //   fontSize: "14px",
  // });
  // $(".addressDiv > div:eq(3)").css({
  //   lineHeight: "22px",
  //   color: "#757575",
  //   fontSize: "14px",
  // });
  // $(".addressDiv > div:eq(3) p").css({
  //   marginBottom: 0,
  // });
  // $(".del").css({
  //   float: "right",
  //   border: 0,
  //   backgroundColor: "#fff",
  //   color: "#ff6a00",
  // });
  //把该地址写入数据库
  // let addList = await $.ajax({
  //   type: "post",
  //   url: "http://1.117.85.143:5566/address",
  //   dataType: "json",
  //   data: { name, tag, tel, ssq, detail },
  // });
});
//点击删除，删除此地址
$(document).on("click", ".del", async function () {
  // let id = $(".addressDiv").attr("data-id");
  $(this).parent().parent().remove();
  // let list = await $.ajax({
  //   type: "delete",
  //   dataType: "json",
  //   url: "http://1.117.85.143:5566/address/" + id,
  // });
});

//点击取消 shadow消失
$(".cancel").click(function () {
  $(".shadow").hide();
});

//选择省市区
$(document).on("click", ".address-prov span", function () {
  let next = $(this).attr("data-id"); //标记该省份对应的城市
  $(`.${next}`).show(); //
  $(this).parent().hide();
  $(".unselect").html("选择城市");
  $(".ssq-selected span:eq(0)").html($(this).html());
});
$(document).on("click", ".address-city span", function () {
  let next = $(this).attr("data-id"); //标记该城市对应的的区
  $(`.${next}`).show();
  $(this).parent().hide();
  $(".unselect").html("选择区县");
  $(".ssq-selected span:eq(1)").html($(this).html()).attr("data-id", next);
});

$(document).on("click", ".address-area span", function () {
  $(".ssq-selected span:eq(2)").html($(this).html());
  $(".address-select").hide();
  let str =
    $(".ssq-selected span:eq(0)").html() +
    " / " +
    $(".ssq-selected span:eq(1)").html() +
    " / " +
    $(".ssq-selected span:eq(2)").html();
  $(".pop").val(str);
});
$(document).on("click", ".ssq-selected span:eq(0)", function () {
  $(".address-prov").show().siblings().hide();
  $(".ssq-selected span:eq(1)").html("");
  $(".ssq-selected span:eq(2)").html("");
});

//关闭
$(".close").click(function () {
  $(".address-select").hide();
});

//点击弹出选择省市区
$(".pop").click(function () {
  $(".address-select").show();
});

import $ from "../jquery.min.js";

getPhoneList();
async function getPhoneList() {
  let list = await $.ajax({
    type: "get",
    url: "http://1.117.85.143:5566/phoneList",
    dataType: "json",
  });

  let html = "";
  list.forEach(function (item) {
    let { id, img, name, desc, price } = item;
    html += `
    <li data-id="${id}">
          <a href="#">
          <img src="${img}" alt="">
          <p>${name}</p>
          <p>${desc}</p>
          <p>
              <span>${price}</span>
          </p>
          </a>
    </li>
          `;
  });

  $(".phone .phone-list").html(html);
}

getKillList();
async function getKillList() {
  let list = await $.ajax({
    type: "get",
    url: "http://1.117.85.143:5566/seckillList",
    dataType: "json",
  });

  let html = "";
  list.forEach(function (item) {
    let { img, name, desc, priceOld, priceNew, id } = item;
    html += `
      <li data-id="${id}">
            <a href="#">
            <img src="${img}" alt="">
            <p>${name}</p>
            <p>${desc}</p>
            <p>
                <span>${priceNew}</span>
                <span>${priceOld}</span>
            </p>
            </a>
      </li>
            `;
  });
  //渲染页面
  $(".killgoods").html(html);

  //秒杀列表点击左滑右滑
  let killIndex = 0;
  let killLen = list.length;
  let restCount = killLen % 4; //最后余下的个数
  let toatlCount = Math.floor(killLen / 4); //总共需要点击的次数 2

  $(".seckill .icon-youjiantou").click(function () {
    killIndex++;
    $(".icon-zuojiantou").css({
      color: "#333333",
    });
    //如果转到了最后一页
    if (killIndex >= toatlCount) {
      $(".killgoods").animate(
        {
          left: (toatlCount - 1) * -988 + restCount * -247,
        },
        700
      );
      $(this).css({
        left: (toatlCount - 1) * -988 + restCount * -247,
        color: "#e0e0e0",
      });
      killIndex = toatlCount;
    } else {
      $(".killgoods").animate(
        {
          left: killIndex * -988,
        },
        700
      );
    }
  });

  $(".icon-zuojiantou").click(function () {
    killIndex--;
    $(".icon-youjiantou").css({
      color: "#333333",
    });
    if (killIndex <= 0) {
      $(".killgoods").animate(
        {
          left: 0,
        },
        700
      );
      killIndex = 0;
      $(this).css({
        left: 0,
        color: "#e0e0e0",
      });
    } else {
      $(".killgoods").animate(
        {
          left: killIndex * -988,
        },
        700
      );
    }
  });
}

/////////////////////////////家电板块///////////////////
getJiadianList();
async function getJiadianList() {
  let list = await $.ajax({
    type: "get",
    url: "http://1.117.85.143:5566/jiadianList",
    dataType: "json",
  });

  //左边大图片
  let html0 = "";
  list[0].forEach(function (item) {
    let { img } = item;
    html0 += `
                <li>
                    <a href="#">
                    <img src="${img}" alt="">
                    </a>
                </li>
    `;
  });
  $(".jiadianTitle").html(html0);
  //////////////////////第一次渲染列表//////////////
  renderList1(0);
  $(".jiadian-p span").eq(0).addClass("active");
  //////////////////////切换选项卡///////////////////
  $(".jiadian-p span").on("mouseover", function () {
    let index = $(this).index();
    $(this).addClass("active").siblings().removeClass("active");
    renderList1(index);
  });

  ///////////////////////////渲染列表/////////////////////
  function renderList1(index) {
    let html1_list = "";
    let html1_last = "";
    //前七个
    for (let i = 0; i < 7; i++) {
      let { id, img, name, desc, price } = list[index + 1][i];
      html1_list += `
            <li data-id="${id}"> 
                    <a href="#">
                        <img src="${img}" alt="">
                        <h3>${name}</h3>
                        <p>${desc}</p>
                        <p>
                            <span>${price}</span>
                        </p>
                    </a>
            </li>
        `;
    }

    //   最后一个
    let { img, name, price } = list[index + 1][7];
    html1_last += `
      <li data-id="8">
      <a href="#">
          <div class="top">
              <img src="${img}" alt="">
              <h3>${name}</h3>
              <p>${price}</p>
          </div>
      </a>
    
      <a href="#">
          <div class="sub">
              <em class="iconfont icon-arrowRight"></em>
              <h3>浏览更多</h3>
              <p>热门</p>
          </div>
      </a>
    
    </li>
          `;
    $(".jiadianList").html(html1_list + html1_last);
  }
}

//////////////////////////智能板块//////////////////////
getZhinengList();
async function getZhinengList() {
  let list = await $.ajax({
    type: "get",
    url: "http://1.117.85.143:5566/zhinengList",
    dataType: "json",
  });

  //左边大图片
  let html0 = "";
  list[0].forEach(function (item) {
    let { img } = item;
    html0 += `
                <li>
                    <a href="#">
                    <img src="${img}" alt="">
                    </a>
                </li>
    `;
  });
  $(".zhinengTitle").html(html0);

  //////////////////////第一次渲染列表//////////////
  renderList2(0);
  $(".zhineng-p span").eq(0).addClass("active");
  //////////////////////切换选项卡///////////////////
  $(".zhineng-p span ").on("mouseover", function () {
    let index = $(this).index();
    $(this).addClass("active").siblings().removeClass("active");
    renderList2(index);
  });

  ///////////////////////////渲染列表/////////////////////
  function renderList2(index) {
    let html1_list = "";
    let html1_last = "";
    //前七个
    for (let i = 0; i < 7; i++) {
      let { id, img, name, desc, price } = list[index + 1][i];
      html1_list += `
              <li data-id="${id}">
                      <a href="#">
                          <img src="${img}" alt="">
                          <h3>${name}</h3>
                          <p>${desc}</p>
                          <p>
                              <span>${price}</span>
                          </p>
                      </a>
              </li>
          `;
    }
    //   最后一个
    let { img, name, price } = list[index + 1][7];
    html1_last += `
        <li data-id="8">
        <a href="#">
            <div class="top">
                <img src="${img}" alt="">
                <h3>${name}</h3>
                <p>${price}</p>
            </div>
        </a>

        <a href="#">
            <div class="sub">
                <em class="iconfont icon-arrowRight"></em>
                <h3>浏览更多</h3>
                <p>热门</p>
            </div>
        </a>

      </li>
            `;
    $(".zhinengList").html(html1_list + html1_last);
  }
}

////////////////点击商品跳转相应页面///////////
$(document).on("click", ".more", function (e) {
  e.stopPropagation();
  window.location.href = "list.html";
});
$(document).on("click", ".killgoods li", function () {
  let id = $(this).attr("data-id");
  window.location.href = "detail.html?id=" + id;
});
$(document).on("click", ".phone-list li", function () {
  let id = $(this).attr("data-id");
  window.location.href = "detail.html?id=" + id;
});
$(document).on("click", ".jiadianList li", function () {
  let id = $(this).attr("data-id");
  window.location.href = "detail.html?id=" + id;
});
$(document).on("click", ".jiadianList .sub", function (e) {
  e.stopPropagation();
  window.location.href = "list.html";
});
$(document).on("click", ".zhinengList li", function () {
  let id = $(this).attr("data-id");
  window.location.href = "detail.html?id=" + id;
});
$(document).on("click", ".zhinengList .sub", function (e) {
  e.stopPropagation();
  window.location.href = "list.html";
});
$(document).on("click", ".zhinengList .sub", function (e) {
  e.stopPropagation();
  window.location.href = "list.html";
});

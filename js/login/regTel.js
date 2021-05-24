import $ from "../jquery.min.js";
import $cookie from "../cookie.js";

let reg1 = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; //邮箱
let reg2 = /^1(3|5|7|8|4)\d{9}$/; //手机号

//点击获取验证码，判断手机号是否已注册 已注册就返回登录，未注册就新增验证码
$(".getcode").click(async function () {
  let usertel = $(".usertelInput").val();
  let usercode = 1000 + Math.round(Math.random() * 8999);

  //判断手机号格式是否正确
  if (reg2.test(usertel)) {
    //注册信息
    regInfo();
    async function regInfo() {
      let list = await $.ajax({
        type: "get",
        url: "http://1.117.85.143:5566/userinfo",
        dataType: "json",
        data: { usertel },
      });
      //判断手机号是否已被注册
      if (list.length) {
        alert("该手机号已注册,请返回登录");
      } else {
        alert("验证码为" + usercode);
        $.ajax({
          type: "post",
          url: "http://1.117.85.143:5566/userinfo",
          data: { usertel, usercode },
          dataType: "json",
        });
        //注册信息之后,把信息存到cookie里面,记录哪个手机号注册的
        document.cookie = `usertel=${usertel}`;
        //启动定时器
        let count = 10;
        let timer = null;
        $(".getcode").html(`10s后可以再次发送`).prop("disabled", true);
        timer = setInterval(function () {
          count--;
          $(".getcode").html(`${count}s后可以再次发送`);
          if (count == 0) {
            clearInterval(timer);
            $(".getcode").html("获取验证码");
          }
        }, 1000);
      }
    }
  } else {
    alert("请输入正确的手机号");
  }
});

//检验验证码是否正确
$(".reg").click(function () {
  let usertel = $(".usertelInput").val();
  let usercode = $(".usercodeInput").val();

  getList();
  async function getList() {
    let list = await $.ajax({
      type: "get",
      url: "http://1.117.85.143:5566/userinfo",
      data: { usertel, usercode },
      dataType: "json",
    });

    if (list.length) {
      location.href = "./reg.html";
    } else {
      alert("验证码错误");
    }
  }
});

//切换到登录
$(document).on("click", "#head_login", function () {
  $("#box1").show();
  $("#box2").hide();
});
//切换到注册
$(document).on("click", "#head_reg", function () {
  $("#box2").show();
  $("#box1").hide();
});

//登录分别验证用户名电话
$(".login").click(function () {
  let userinfo = $(".usernameInput").val();
  let userpwd = $(".userpwdInput").val();

  let data = {};
  if (reg2.test(userinfo)) {
    //如果是手机号
    data = { usertel: userinfo, userpwd };
  } else if (reg1.test(userinfo)) {
    //如果是用户名
    data = { username: userinfo, userpwd };
  }

  getInfo();
  async function getInfo() {
    let list = await $.ajax({
      type: "get",
      url: "http://1.117.85.143:5566/userinfo",
      dataType: "json",
      data,
    });
    //如果查得到，证明用户名和密码匹配
    if (list.length) {
      window.location.href = "index.html";
      window.localStorage.setItem("user_logged", JSON.stringify(list));
      let backurl = window.localStorage.getItem("backurl");
      if (backurl) {
        window.localStorage.href = backurl;
      } else {
        window.location.href = "index.html";
      }
    } else {
      alert("用户名和密码不匹配");
    }
  }
});

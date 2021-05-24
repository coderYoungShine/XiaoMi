import $ from "../jquery.min.js";
import $cookie from "../cookie.js";
$(".reg").click(async function () {
  let username = $(".usernameInput").val();
  let userpwd = $(".userpwdInput").val();
  let userpwd2 = $(".userpwdInput2").val();
  let reg1 = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/; //用户名

  //找到是哪个手机号注册的
  let usertel = $cookie("usertel");
  //先根据usertel找到id
  let list = await $.ajax({
    type: "get",
    url: "http://1.117.85.143:5566/userinfo",
    data: { usertel },
    dataType: "json",
  });
  let id = list[0].id;
  //判断用户名是否合法
  if (reg1.test(username)) {
    //判断该用户名是否已被注册
    let usernameList = await $.ajax({
      type: "get",
      url: "http://1.117.85.143:5566/userinfo",
      data: { username },
      dataType: "json",
    });
    console.log(usernameList);
    if (usernameList.length) {
      alert("用户名已存在,无法注册");
    } else {
      if (userpwd == userpwd2) {
        getInfo();
        async function getInfo() {
          //根据id添加密码和用户名
          let list = await $.ajax({
            type: "patch",
            url: "http://1.117.85.143:5566/userinfo/" + id,
            dataType: "json",
            data: { username, userpwd },
          });
          if (list != null) {
            //后端数据写入成功
            location.href = "./login.html";
          }
        }
      } else {
        alert("两次密码不一致");
      }
    }
  } else {
    alert("用户名不能含有非法字符");
  }
});

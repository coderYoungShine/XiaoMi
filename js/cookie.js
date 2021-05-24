//////////////////////////////视频cookie///////////////////////
function setCookie(name, value, { expires, path, domain, secure }) {
  var cookieStr = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  if (expires) {
    cookieStr += ";expires=" + afterOfDate(expires);
  }
  if (path) {
    cookieStr += ";path=" + path;
  }
  if (domain) {
    cookieStr += ";domain=" + domain;
  }
  if (secure) {
    cookieStr += ";secure";
  }
  document.cookie = cookieStr;
}

//获取n天后的日期
function afterOfDate(n) {
  var d = new Date();
  var day = d.getDate();
  d.setDate(n + day);
  return d;
}

function getCookie(name) {
  var cookieStr = decodeURIComponent(document.cookie);
  var start = cookieStr.indexOf(name + "=");
  if (start == -1) {
    return null;
  } else {
    //查询从start位置开始遇到的第一个分号
    var end = cookieStr.indexOf(";", start);
    if (end == -1) {
      end = cookieStr.length;
    }

    //进行字符串提取
    var str = cookieStr.substring(start, end);
    var arr = str.split("=");
    return arr[1];
  }
}

function removeCookie(name) {
  document.cookie = encodeURIComponent(name) + "=;expires=" + new Date(0);
}

/* 
                【注】在使用一个方法实现三个功能的时候。
                     通过传入参数的数量识别：

                     设置cookie
                     $cookie(name, value);
                     $cookie(name, value, {});

                     获取cookie
                     $cookie(name);

                     删除cookie
                     $cookie(name, null);
            */

function $cookie(name) {
  //判断传入参数的个数
  switch (arguments.length) {
    case 1:
      return getCookie(name);
      break;
    case 2:
      if (arguments[1] == null) {
        removeCookie(name);
      } else {
        setCookie(name, arguments[1], {});
      }
      break;
    default:
      setCookie(name, arguments[1], arguments[2]);
      break;
  }
}

export default $cookie;

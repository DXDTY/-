$.ajaxPrefilter(function (options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  options.url = 'http://www.liulongbin.top:3007' + options.url;

  // 统一为有权限的接口设置请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = { Authorization: localStorage.getItem('token') || '' }
  }
  options.complete = function (res) {
    if (res.responseJSON.status === 1) {
      localStorage.removeItem('token');
      location.href = "./login.html";
    }
  }
})
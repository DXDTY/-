$(function () {
  let layer = layui.layer;

  // 获取用户基本信息
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败！')
      }

      let data = res.data;
      let name = data.username || data.nickname;
      $('.layui-header #left_user').html('欢迎：' + name);
      if (data.user_pic == null) {
        // 渲染文本图像
        $('.layui-header img').hide();
        let first = name[0].toUpperCase();
        $('.layui-header .img').html(first).show();
      } else {
        // 渲染图片图像
        $('.layui-header .img').hide();
        $('.layui-header img').prop('src', data.user_pic).show();
      }
    }
  })

  //点击退出
  $('#btn_goout').on('click', function (ers) {
    layer.confirm('此操作将退出登录, 是否继续?', { icon: 3, title: '提示' }, function (index) {
      location.href = "./login.html";
      localStorage.removeItem('token');
      //关闭弹出框
      layer.close(index);
    });
  })
})
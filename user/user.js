$(function () {
  shows();
  let form = layui.form;
  // 昵称输入规则
  form.verify({
    nickname: [/^[\S]{1,10}$/, '昵称必须1到10位，且不能出现空格'],
  })
  let ids = null;

  //初始化用户信息
  function shows() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      data: {},
      success: function (res) {
        let data = res.data;
        // 调用 form.val()快速为表单赋值与取值
        form.val('formUserInfo', data);
        ids = data.id;
      }
    })
  }

  //提交修改
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    let nicknames = $('[name=nickname]').val();
    let emails = $('[name=email]').val();
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: { id: ids, nickname: nicknames, email: emails },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！');
        }
        layer.msg('更新用户信息成功！', {
          icon: 1,
          time: 2000 //2秒关闭（如果不配置，默认是3秒）
        }, function () {
          //do something
        });

        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.mainshow();
        // $(window.parent.document).mainshow();
      }
    })
  })
  //重置
  $('#reset').on('click', function (e) {
    e.preventDefault();
    shows();
  })
})
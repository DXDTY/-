$(function () {
  let form = layui.form;
  let layer = layui.layer;
  // 表单密码框验证
  form.verify({
    pass: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    repass: function (value) {
      let passval = $('#newPwd').val();
      if (passval !== value) {
        return '两次密码不一致！';
      }
    }
  });

  //密码提交修改
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    let oldPwds = $('[name=oldPwd]').val();
    let newPwds = $('[name=newPwd]').val();
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: { oldPwd: oldPwds, newPwd: newPwds },
      success: function (res) {
        $('.layui-form input').val('');
        if (res.status !== 0) {
          return layer.msg('更新用户密码信息失败！');
        }
        layer.msg('更新用户密码信息成功！', {
          icon: 1,
          time: 2000 //2秒关闭（如果不配置，默认是3秒）
        }, function () {
        });

      }
    })
  })
})
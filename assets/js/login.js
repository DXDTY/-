$(function () {

  // 点击注册账号的链接
  $('#link_reg').on('click', function () {
    $('.register-box').show();
    $('.login-box').hide();
    $('.loginAndregistration').css({
      height: 310
    });
  });

  // 点击登录账号的链接
  $('#link_login').on('click', function () {
    $('.register-box').hide();
    $('.login-box').show();
    $('.loginAndregistration').css({
      height: 270
    })
  })

  let form = layui.form;
  let layer = layui.layer;
  // 表单输入框验证
  form.verify({
    username: function (value) {
      if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
        return '用户名不能有特殊字符';
      }
      if (/(^\_)|(\__)|(\_+$)/.test(value)) {
        return '用户名首尾不能出现下划线\'_\'';
      }
      if (/^\d+\d+\d$/.test(value)) {
        return '用户名不能全为数字';
      }

      //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
      if (value === '傻逼') {
        alert('用户名不能为敏感词');
        return true;
      }
    },

    pass: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    repass: function (value) {
      let passval = $('.register-box [name=password]').eq(0).val();
      if (passval !== value) {
        return '两次密码不一致！';
      }
    }
  });

  // 注册页面的注册事件
  $('#form_reg').on('submit', function (e) {
    e.preventDefault();
    let username = $('#form_reg [name=username]').val().trim();
    let password = $('#form_reg [name=password]').eq(0).val().trim();
    let datas = {
      username: username,
      password: password
    }
    $.ajax({
      type: 'POST',
      url: '/api/reguser',
      data: datas,
      success: function (res) {
        if (res.status !== 0) {
          $('#form_reg input').val('');
          return layer.msg(res.message);
        }
        layer.msg('注册成功！');
        // 返回登录页面
        $('#link_login').click();
        $('#form_reg input').val('');
      }
    })

  })

  // 登录页面的登录事件
  $('#form_login').on('submit', function (e) {
    e.preventDefault();
    let datas = $(this).serialize();
    $.ajax({
      method: 'POST',
      url: "/api/login",
      data: datas,
      success: function (res) {
        if (res.status !== 0) {
          $('#form_login input').val('');
          return layer.msg(res.message);
        }
        layer.msg('登录成功！');
        localStorage.setItem('token', res.token);
        location.href = './index.html';
      }
    })
  })



}) 
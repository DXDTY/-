$(function () {
  shows();

  let layer = layui.layer;
  // 初始化表格
  function shows() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      data: {},
      success: function (res) {
        if (res.status == 1) {
          return layer.msg('获取文章分类列表失败！');
        }
        let str = template('art_cale', res);
        $('#shows').html(str);
      }
    })
  }
  let index = null;
  // 添加类别
  $('.layui-card-header button').on('click', function () {
    index = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '添加文章分类',
      content: $('#art_form').html(),
    });

    // 添加确认按钮
    $('body').on('submit', 'form.art_form', function (e) {
      e.preventDefault();
      let datas = $('form.art_form').serialize();
      $.ajax({
        method: 'POST',
        url: '/my/article/addcates',
        data: datas,
        success: function (res) {
          if (res.status !== 0) { return layer.msg('新增分类失败！') }
          layer.msg('新增分类成功！');
          layer.close(index);
          shows();
        }
      })
    })
  })

  //取消按钮
  $('body').on('click', '.cancel', function () {
    layer.close(index);
  })

  //修改类别
  $('#shows').on('click', '.alter', function () {
    let names = $(this).parent().parent().children().eq(1).html();
    let alias = $(this).parent().parent().children().eq(2).html();
    index = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '修改文章分类',
      content: $('#art_edit').html(),
    });
    $('#names').val(names);
    $('#aliass').val(alias);
    let ids = $(this).parent().parent().prop('id');
    // 修改确认按钮
    $('body').on('submit', 'form.art_edit', function (e) {
      e.preventDefault();
      let names = $(this).find('#names').val();
      let aliass = $(this).find('#aliass').val();
      $.ajax({
        method: 'POST',
        url: '/my/article/updatecate',
        data: { Id: ids, name: names, alias: aliass },
        success: function (res) {
          if (res.status !== 0) { return layer.msg('修改分类失败！') }
          layer.msg('修改分类成功！');
          layer.close(index);
          shows();
        }
      })
    })
  })

  //删除类别
  $('#shows').on('click', '.del', function () {
    let ids = $(this).parent().parent().prop('id');
    layer.confirm('确认删除此分类吗？?', { icon: 3, title: '提示' }, function (index) {
      if (ids == 1 || ids == 2) {
        return layer.msg('管理员不允许删除该类');
      }
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + ids,
        data: { id: ids },
        success: function (res) {
          if (res.status !== 0) { return layer.msg('删除分类失败！') }
          layer.msg('删除分类成功！');
          shows();
        }
      })
      layer.close(index);
    });
  })


})
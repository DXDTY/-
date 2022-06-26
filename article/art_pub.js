$(function () {
  let layer = layui.layer;
  let form = layui.form;
  initcate();
  // 初始化富文本编辑器
  initEditor();

  // 1. 初始化图片裁剪器
  let $image = $('#image');
  // 2. 裁剪选项
  let options = {
    aspectRatio: 10 / 7,
    preview: '.img-preview'
  };
  // 3. 初始化裁剪区域
  $image.cropper(options);

  //选择图片
  $('#chooseimg').on('click', function () {
    $('#file').click();
  })
  //文件选择
  $('#file').on('change', function (e) {
    let filelist = e.target.files;
    if (filelist.length <= 0) {
      return layer.msg('请选择照片！');
    }
    let imgURL = URL.createObjectURL(filelist[0]);
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', imgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  //初始化分类数据
  function initcate() {
    //获取文章分类
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      data: {},
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类列表失败！');
        }
        let str = template('art_pub', res);
        $('#show_cale').html(str);
        // 一般当表单存在动态生成时，进行渲染
        form.render(); // 渲染全部
      }
    })
  }
  let art_state = '已发布';
  //点击按钮获取文章状态
  $('form.art_form .btn').on('click', function (e) {
    if ($(this).html() == '存为草稿') {
      art_state = '草稿';
    } else {
      art_state = '已发布';
    }
  })
  //文章发布
  $('form.art_form').on('submit', function (e) {
    e.preventDefault();

    let fd = new FormData($(this)[0]);
    fd.append('state', art_state);
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append('cover_img', blob);
        $.ajax({
          method: 'POST',
          url: '/my/article/add',
          data: fd,
          //需要添加额外的属性
          contentType: false,
          processData: false,
          success: function (res) {
            if (res.status !== 0) {
              return layer.msg('文章发布失败！');
            }
            layer.msg('文章发布成功！');
            location.href = './art_list.html';
          }
        })
      })

  })
  //返回文章列表
  $('.layui-card-header a').on('click', function () {
    layer.confirm('此操作将导致文章信息丢失, 是否继续?', { icon: 3, title: '提示' }, function (index) {
      location.href = './art_list.html';
      layer.close(index);
    });
  })
})
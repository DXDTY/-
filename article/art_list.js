$(function () {
  let q = {
    pagenum: 1, //页码值，默认请求第一页的数据
    pagesize: 2,//每页显示几条数据，默认每页显示两条
    cate_id: '',//文章分类的id
    state: '' //文章的状态
  }
  shows();
  initcate();
  let layer = layui.layer;
  let form = layui.form;
  let laypage = layui.laypage;
  //美化时间的过滤器
  template.defaults.imports.dataFoamat = function (date) {
    let timer = new Date(date);
    let y = padZero(timer.getFullYear());
    let m = padZero(timer.getMonth() + 1);
    let d = padZero(timer.getDay() + 1);
    let hour = padZero(timer.getHours());
    let mength = padZero(timer.getMinutes());
    let second = padZero(timer.getSeconds());
    return y + '-' + m + '-' + d + '-' + hour + '-' + mength + '-' + second;
  }
  //补0函数
  function padZero(data) {
    return data > 9 ? data : '0' + data;
  }
  // 初始化表格:
  function shows() {
    //获取文章列表
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！');
        }
        let str = template('art_lists', res);
        $('#shows').html(str);
        renderPage(res.total);
      }
    })

  }
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
        let str = template('art_cales', res);
        $('#show_cale').html(str);
        form.render();
      }
    })
  }
  //筛选功能
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    let cate_id = $('[name=cate_id]').val();
    let state = $('[name=state]').val();
    q.cate_id = cate_id;
    q.state = state;
    shows();
  })
  //重置功能
  $('.layui-form .cancel').on('click', function () {
    q.cate_id = '';
    q.state = '';
    shows();
  })
  //跳转到发布文章页面
  $('.layui-form .pubart').on('click', function () {
    location.href = './art_pub.html';
  })
  //分页渲染
  function renderPage(total) {
    laypage.render({
      elem: 'test1' //注意，这里的 test1 是 ID，不用加 # 号
      , count: total //数据总数，从服务端得到
      , limit: q.pagesize //每页显示几条数据
      , curr: q.pagenum //获取起始页
      , jump: function (obj, first) {
        //切换触发，first=underfine
        //调用renderPage函数触发，first=true
        //首次不执行
        if (!first) {
          q.pagenum = obj.curr;
          q.pagesize = obj.limit;
          shows();
        }
      },
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 5, 10],
    });

  }
  //删除文章
  $('#shows').on('click', 'button.del', function () {
    let ids = $(this).parent().parent().prop('id');
    let leng = $('#shows tr').length;
    layer.confirm('确认删除此文章吗?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + ids,
        success: function (res) {
          if (res.status !== 0) { return layer.msg('删除分类失败！') }
          layer.msg('删除分类成功！');
          //判断当前页是否有剩余数据
          if (leng == 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          shows();
        }
      })
      layer.close(index);
    });
  })
  // 修改文章
  $('#shows').on('click', 'button.alter', function () {
    let ids = $(this).parent().parent().prop('id');
    localStorage.setItem('alter_id', ids);
    location.href = './art_alter.html';
  })
})
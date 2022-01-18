$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage

  //定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = padZero(dt.getFullYear())
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + '-' + hh + ':' + mm + ':' + ss

  }
  //定义补零函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }


  //定义一个查询参数对象，将来请求数据时候 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1,//页码值
    pagesize: 2,//每页显示多少条数据
    cate_id: '',  //	文章分类的 Id
    state: '',  //文章的状态，可选值有：已发布、草稿

  }

  initTable()
  initCate()


  //获取文章列表数据的方法
  function initTable() {
    $.ajax({
      type: 'get',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取列表失败！！')
        }

        //模板引擎渲页面数据
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        //调用渲染页面的方法
        renderPage(res.total)
        console.log(res)


      }
    })
  }

  //初始化文章分类的方法
  function initCate() {
    $.ajax({
      type: 'get',
      url: '/my/article/cates',
      success: function (res) {

        if (res.status !== 0) {
          return layer.msg("获取分类数据失败！")
        }
        //调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        //通过 layui 重新渲染表单区域的ui结构
        form.render()


      }
    })
  }


  //为筛选表单绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    //获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    //为查询参数对象 q中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    //根据最新的筛选条件，重新渲染表格数据
    initTable()
  })

  //定义渲染分页的方法
  function renderPage(total) {

    laypage.render({
      elem: 'pageBox',//分页容器的 id
      count: total,//总数据条数
      limit: q.pagesize,//每页显示几条数据
      curr: q.pagenum,//设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      //分页发生切换的时候出发jump
      //触发jump回调的方式有两种：1.点击页码的时候 2.调用了laypage.render方法

      jump: function (obj, first) {
        //可以通过first的值，来判断通过哪种方式 触发了jump
        //如果first的值为true，证明是方式1 反之就是方式2
        console.log(obj.curr);
        //把最新的页码值，复制到q这个查询参数中
        q.pagenum = obj.curr
        //把最新的条目数，赋值到q这个查询茶树对象的pagsize属性中、
        q.pagesize = obj.limit
        //根据最新的q获取对应数据列表，并渲染表格
        //inittable
        if (!first) {
          initTable()
        }
      }

    })
  }


  //通过代理的形式，为删除按钮绑定点击事件处理函数
  $('tbody').on('click', '.btn-delete', function () {
    var len = $('.btn-delete').length
    console.log(len);


    //var获取文章的id
    var id = $(this).attr('data-id')
    //询问是否删除数据
    layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {

      $.ajax({
        type: get,
        url: '/my/article/delete' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！！')
          }
          layer.msg('删除文章成功！')
          //当数据删除完成后 需要判断当前这一页中，是否还有剩余的数据
          //如果没有剩余的数据，则让页码值-1之后再重新调用initTable()
          if (len === 1) {
            //页码值最小必须是1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })
      layer.close(index)

    })
  })

})
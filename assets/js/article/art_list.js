$(function () {
  var layer = layui.layer
  var form = layui.form

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
        res.data = [
          { id: 1, title: 'title', cate_name: '美食', pub_date: '2021-1-16 20:9:3.817', state: '草稿' },
          { id: 2, title: 'title', cate_name: '美食', pub_date: '2021-1-16 20:8:8.817', state: '草稿' },
          { id: 3, title: 'title', cate_name: '美食', pub_date: '2021-1-16 20:4:3.817', state: '草稿' },
          { id: 4, title: 'title', cate_name: '美食', pub_date: '2021-1-16 20:8:3.817', state: '草稿' }
        ]



        //模板引擎渲页面数据
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)

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



})
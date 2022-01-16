$(function () {
  //获取文章分类列表
  var layer = layui.layer
  var form = layui.form


  initArtCateList()

  function initArtCateList() {
    $.ajax({
      type: 'get',
      url: '/my/article/cates',
      success: function (res) {
        var htmStr = template('tpl-table', res)
        $('tbody').html(htmStr)
      }
    })
  }
  //为添加类别按钮绑定点击事件
  var indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      title: '添加文章发分类',
      content: $('#dialog-add').html(),
      area: ['450px', '260px']
    })
  })

  //通过代理形式，为form-add表单绑定submit事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    console.log('ok');

    $.ajax({
      type: 'post',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败')
        }
        initArtCateList()
        layer.msg('新增分类成功')

        //根据索引 关闭对应的弹出层
        layer.close(indexAdd)
      }
    })


  })


  //通过代理形式，为btn-edit按钮绑定事件
  $('tbody').on('click', '.btn-edit', function () {
    var indexEdit = null
    //弹出一个修改文章分类信息的层
    //为添加类别按钮绑定点击事件
    indexEdit = layer.open({
      type: 1,
      title: '修改文章发分类',
      content: $('#dialog-edit').html(),
      area: ['450px', '260px']
    })

    var id = $(this).attr('data-id')
    //发起请求获取对应分类数据
    $.ajax({
      type: 'get',
      url: '/my/article/cates/' + id,
      success: function (res) {
        form.val('form-edit', res.data)

      }
    })
  })

  //通过代理的形式，为修改分类的表达那绑定submit事件
  $("body").on("submit", '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      type: 'post',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新数据失败！')
        }
        layer.msg('更新分类数据成功！')
        layer.close(indexEdit)
        initArtCateList()
      }

    })
  })

  //通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    var id = $(this).attr("data-id")
    //提示用户是否要删除
    layer.confirm('确认删除？', { icon: 3, title: '提示' },
      function (index) {
        $.ajax({
          type: 'get',
          url: "/my/article/delete/" + id,
          success: function (res) {
            if (res.status !== 0) {
              return layer.msg("删除分类失败！")

            }
            layer.msg("删除分类成功！")
            layer.close(index)
            initArtCateList()
          }
        })
      })
  })





})


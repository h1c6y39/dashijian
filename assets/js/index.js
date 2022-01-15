$(function () {
  getUserInfo()

  var layer = layui.layer

  //点击按钮实现退出
  $('#btnLogout').on('click', function () {
    //提示用户是否确认退出
    layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
      //1.清空本地存储中的token
      localStorage.removeItem('token')
      //2.重新跳转到登陆页面
      location.href = 'login.html'


      //关闭confirm
      layer.close(index)
    })
  })
})
//获取用户基本信息

function getUserInfo() {
  $.ajax({
    method: 'get',
    url: '/my/userinfo',
    //headers请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: function (res) {

      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败')
      }
      //渲染用户头像
      renderAvatar(res.data)
    }


  })

}

//渲染用户头像
function renderAvatar(user) {
  //1.获取用户名称
  var name = user.nickname || user.username
  //2.设置欢迎文本
  $('.welcome').html('欢迎&nbsp;&nbsp;' + name)
  console.log(user);

  //3.按需渲染用户头像
  if (user.user_pic !== null) {
    //3.1渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    //3.2渲染文本头像
    $('.layui-nav-img').hide()
    var first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}
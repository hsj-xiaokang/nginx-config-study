$(function () {
	alert();
	/* 检测sessoin */
	checkSession();
});

/* 检测session */
function checkSession () {
	console.log('检测session');
	var userInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
	var template = '';
	console.log('userInfo: ');
	console.log();
	if (userInfo) { //已经登录
		/* 企业用户 */
		if (userInfo.countType === '企业用户') {
			template = 	'<a class="user" href="./enterprise/member_home.html"><img src="img/huiyuan.png"><span>'+userInfo.username+'</span></a>'+
				'<a href="./enterprise/message.html">消息</a>'+
				'<a class="login-out">退出登录</a>'
		}
		/* 政府用户 */
		if (userInfo.countType === '政府用户') {
			template = 	'<a onclick="openUrl()" class="user" href="javascript:void(0)"><img src="./../img/huiyuan.png"><span>'+userInfo.username+'</span></a>'+
				'<a class="login-out" onclick="loginOut()">退出登录</a>'

		}
	}
	else { //没登录
		template = 	'<a class="user" href="member_login.html"><img src="../img/huiyuan.png"><span>会员登录</span></a>';
	}
	$('.top .container').append(template)
}
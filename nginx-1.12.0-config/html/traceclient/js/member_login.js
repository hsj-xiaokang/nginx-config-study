/* memger_login */


(function () {
	/* 倒计时获取数字 */
	var maxtime;
	var runNumber = false; //是否处于倒计时状态
	if (window.name == '' || window.name <= 0 || isNaN(window.name)) {
		maxtime = 120;
	}
	else {
		maxtime = window.name;
		runNumber = true;
		/* 倒计时 */
		var clear = setInterval(function () {
			$('.getCode').text(--maxtime+'s后重发');
			window.name = maxtime;

			if (maxtime === 0) {
				clearInterval(clear);
				$('.getCode').text('获取验证码');
				runNumber = false;
			}

		},1000)
	}

	/* 用户登录 */
	$('.login-button').on('click', userLogin);

	/* 用户登录 - 回车事件 */

	$(document).keyup(function (event) {
		if (event.keyCode == 13) {
			$('.login-button').click();
		}
	});



	/* 点击忘记密码弹出修改密码框 */
	$('.forget-password').on('click', function () {
		$('#form-wrapper').hide();
		$('#forget-password-modal').show();
	});

	/* 点击叉关闭框 */
	$('#close1,#close2').on('click', function () {
		$('#forget-password-modal').hide();
		$('#form-wrapper').show();
	});

	/* 忘记密码 - 获取验证码*/
	var uid = 0; /* uid */
	$('#forget-password-wrapper1 .getCode').on('click', function () {
		/* 如果此时处于倒计时中 直接return */
		if (runNumber) return;
		$('#forget-password-wrapper1 .error').eq(0).text(''); //重置错误提示
		$('#forget-password-wrapper1 .error').eq(1).text('');
		var phone = $('#forget-password-wrapper1 .userPhone input').val();
		if (phone.length === 0) {
			$('.error').eq(0).text('请输入手机号码');
			return;
		}
		if (phone.length < 11) {
			$('.error').eq(0).text('手机号码为11位');
			return;
		}
		$('#forget-password-wrapper1 .getCode').unbind('click'); //多次点击取消上次绑定的事件
		$.ajax({
			url: verifyCode,
			type: 'POST',
			dataType: 'json',
			data: {username: phone},
			success: function (data) {
				console.log('success!');
				console.log(data);
				if (data.flag === 0) {
					$('#forget-password-wrapper1 .error').eq(0).text(data.message);
					return;
				}
				if (data.flag === 1 && data.message.indexOf('成功') > -1) {
					uid = data.data.uid;
					/* 倒计时 */
					var clear = setInterval(function () {
						if (maxtime <= 0) maxtime = 120;
						$('#forget-password-wrapper1 .getCode').text(--maxtime+'s重发');
						window.name = maxtime;
						runNumber = true;
						if (maxtime === 0) {
							clearInterval(clear);
							$('#forget-password-wrapper1 .getCode').text('获取验证码');
							runNumber = false;
						}

					},1000)
				}
				else {
					$('#forget-password-wrapper1 .error').eq(0).text('手机号码不存在');
					return;
				}
			},
			error: function () {
				console.log('fail!');
			}
		})

	});

	/* 忘记密码 - 下一步 */
	$('#forget-password-wrapper1 .next-submit').on('click', function () {
		$('#forget-password-wrapper1 .error').eq(0).text(''); //重置错误提示
		$('#forget-password-wrapper1 .error').eq(1).text('');

		var phone = $('#forget-password-wrapper1 .userPhone input').val();
		var code = $(' #forget-password-wrapper1 .userCode input').val();
		console.log('code = '+code);
		if (phone.length === 0) {
			$('#forget-password-wrapper1 .error').eq(0).text('请输入手机号码');
			return;
		}
		if (phone.length < 11) {
			$('#forget-password-wrapper1 .error').eq(0).text('手机号码为11位');
			return;
		}
		if (code.length === 0) {
			console.log('请输入验证码!');
			$('#forget-password-wrapper1 .error').eq(1).text('请输入验证码');
			return;
		}
		if (code.length !== 4) {
			console.log('验证码为4位');
			$('#forget-password-wrapper1 .error').eq(1).text('验证码为4位');
			return;
		}
		/* 验证 验证码 */
		$.ajax({
			url: verifyCodeFlag,
			type: 'POST',
			dataType: 'json',
			data: {sendaccount: phone, sendcode: code},
			success: function (data) {
				console.log('成功!');
				console.log(data);
				if (data.flag === 1) {
					$('#forget-password-wrapper1').hide();
					$('#forget-password-wrapper2').show();
				}
				else {
					$('#forget-password-wrapper1 .error').eq(1).text('验证码错误');
				}
			},
			error: function () {
				console.log('error!');
			}
		})

	});

	/* 忘记密码 - 完成 */
	$('#forget-password-wrapper2 .next-submit').on('click', function () {

		$('#forget-password-wrapper2 .error').eq(0).text(''); //重置错误提示
		$('#forget-password-wrapper2 .error').eq(1).text('');
		var password = $('#forget-password-wrapper2 .userPhone input').val();
		var passwordAgain = $('#forget-password-wrapper2 .userCode input').val();
		console.log('password = '+password);
		console.log('passwordAgain = '+passwordAgain);
		console.log('uid = '+uid);
		// 验证数据
		if (password.length === 0) {
			console.log('请输入新密码');
			$('#forget-password-wrapper2 .error').eq(0).text('请输入新密码');
			return;
		}
		if (password.length < 6) {
			$('#forget-password-wrapper2 .error').eq(0).text('密码为6-12位中英文字符');
			return;
		}
		if (passwordAgain.length === 0) {
			$('#forget-password-wrapper2 .error').eq(1).text('请再次输入新密码');
			return;
		}
		if (passwordAgain !== password) {
			$('#forget-password-wrapper2 .error').eq(1).text('两次输入的密码不一致');
			return;
		}
		/* 发送请求 */
		$.ajax({
			url: inChangePassword,
			type: 'POST',
			dataType: 'json',
			data: {uid: uid, userpassword: password},
			success: function (data) {
				console.log(data);
				if (data.flag === 1) {
					console.log('success!');
					alert('密码修改成功!');
					window.location.reload();
					/* 修改成功以后 倒计时? */
				}
			},
			error: function () {
				console.log('fail!');
			}
		})

	});

})();

/* 用户登录 */
function userLogin() {
	/*$('.login-button').css('color','red');*/
	/* 密码账号空 */
	var user = $('[type="text"]').val();
	var password = $('[type="password"]').val();
	if (user.length === 0) {
		$('.form-error').text('请输入账户').show();
		return;
	}
	else if (password.length === 0) {
		$('.form-error').text('请输入密码').show();
		return;
	}
	else if (password.length > 0 && user.length > 0) {
		$('.form-error').hide();
		$('.login-button').addClass('login-process');
		console.log('用户登录!');
		/*  判断企业or政府 */
		$.ajax({
			url: login,
			type: 'POST',
			dataType: 'json',
			timeout: 5000,
			data: {username: $('[type="text"]').val(), userpassword: $('[type="password"]').val()},
			success: function (data){
				console.log(data);
				if (data.flag === 0) { //失败
					$('.form-error').text(data.message).show();
				}
				if (data.flag === 1){ //成功
					 /*企业*/
					sessionStorage.setItem('loginInfo',JSON.stringify(data.data[0]));
					if (data.data[0].countType === '企业用户') {
						/* 跳转 */
						selectPath();
					}
					/* 政府 */
					if (data.data[0].countType === '政府用户') {
						window.location.href = './government/government_home.html?uid=' + data.data[0].uid;
					}
				}
			},
			error: function (){
				$('.form-error').text('服务异常').show();
				console.log('服务异常!');
			},
			complete: function () {
					$('.login-button').removeClass('login-process');
			}
			
		});
	}
}
/* 根据uid 获取 enterpriseid */
function selectPath () {
	console.log('获取enterpriseid');
	console.log('session-登录信息');
	console.log(JSON.parse(sessionStorage.getItem('loginInfo')));

	if (!JSON.parse(sessionStorage.getItem('loginInfo'))) {
		window.location.replace('../index.html');
	}
	$.ajax({
		url: enterpriseByUserId,
		type: 'POST',
		dataType: 'json',
		async: false,
		data: {
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			userid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
		success: function (data) {
			console.log('获取enterpriseid成功!');
			console.log(data);
			if (data.flag === 1 && data.data && data.data.enterpriseid) {
				sessionStorage.setItem('enterpriseid' ,data.data.enterpriseid);
				console.log('获取的enterpriseid = ' + sessionStorage.getItem('enterpriseid'));
				window.location.href = './enterprise/member_home.html';
			}
			else {
				/* 如enterpriseid为空 则为新建企业 */
				console.log('enterpriseid为空!');
				window.location.href = './enterprise/base_info.html';

			}
		},
		error: function () {
			console.log('获取enterpriseid失败!');
		}
	});
}







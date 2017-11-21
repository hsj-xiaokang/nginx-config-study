/* account_safe */
$(function () {

	/* 点击'完成' 更改密码 */
	$('.form-submit>div').click(function () {
		$('.form-error').css('color','#FFF');
		/* 验证数据 */
		var oldPassword = $(".form-group:first-child input").val();
		var newPassword = $(".form-group input").eq(1).val();
		var newPasswordAgain = $(".form-group input").eq(2).val();
		console.log(oldPassword);
		console.log(newPassword);
		console.log(newPasswordAgain);

		if (oldPassword.length === 0) {
			$('.form-error').eq(0).css('color','red').text('请输入旧密码');
			return;
		}
		if (newPassword.length === 0) {
			$('.form-error').eq(1).css('color','red').text('请输入新密码');
			return;
		}
		if (newPassword.length < 8) {
			$('.form-error').eq(1).css('color','red').text('密码长度为8-12位');
			return;
		}
		if (newPasswordAgain.length === 0) {
			$('.form-error').eq(2).css('color','red').text('请再次输入新密码');
			return;
		}
		if (newPassword !== newPasswordAgain) {
			$('.form-error').eq(2).css('color','red').text('两次输入密码不一致');
			return;
		}
		/* ajax *//* 根据 uid 修改密码 */
		$.ajax({
			url: inChangePassword,
			type: 'POST',
			dataType: 'json',
			data: {
				uid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
				operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
				lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode,
				userpassword: newPasswordAgain,
				oldUserPassword: oldPassword
			},
			success: function (data) {
				console.log('success!');
				console.log(data);
				if (data.flag === 0) {
					$('.form-error').eq(0).css('color','red').text('旧密码错误');
				}
				if (data.flag === 1) {
					console.log('修改成功!');
					$('#form-wrapper').hide();
					$('#login-success-wrapper').show();
					/* 倒计时 */
					var number = 5;
					var clear = setInterval(function () {
						$('.login-success-number').text(--number);
						if (number === 0) {
							clearInterval(clear);
							window.location.replace('../member_login.html');
						}
					}, 1000)

				}
			},
			error: function () {
				console.log('fail!');
			}
		})
	});
	/* 点击 '立刻登录' */
	$('.quick-login').click(function () {
		console.log('adsfasd');
		window.location.href = '../member_login.html';
	});
});

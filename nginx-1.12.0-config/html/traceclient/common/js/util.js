
//全局的ajax访问
$.ajaxSetup({
	complete:function(data){
		//通过XMLHttpRequest取得响应结果
		if (!data.responseJSON) return; //过滤loader函数
		if (data.responseJSON.flag === 2) {
			
			$('.errorInfo').text(data.responseJSON.message);
			$('#myModal-error').modal('show');
			sessionStorage.removeItem('loginInfo');
			sessionStorage.removeItem('enterpriseid');
			$('#myModal-error').on('hide.bs.modal', function () {
				window.location.replace('../index.html');
			});
		}
	}
});


/* 检测loginInfo */

(function checkLoginInfo () {
	if (!sessionStorage.getItem('loginInfo')) {
		window.location.replace('../index.html')
	}
})();

/* 检测enterpriseid */
(function checkBaseInfo () {

	/* enterpriseid 不存在 跳转至基本信息页面 */
	if (!sessionStorage.getItem('enterpriseid')) {
		console.log('基本信息为空!');
		$('a').not('.pull-left,#breadcrumb a,.leave-home').click(function(){
			$('.errorInfo').text('请完善企业信息');
			$('#myModal-error').modal('show');
			return false;
		});
	}
	if (!sessionStorage.getItem('enterpriseid') && window.location.href.indexOf('base_info') === -1) {
		window.location.href = 'base_info.html';
	}
})();

/* 设置头部消息 */
(function setUserInfo () {
	var userInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
	if (userInfo) {
		$('.user span').text(userInfo.username);
	}
})();

/* 获取未读消息个数 */
function getMessageCount () {
	$.ajax({
		url: messageCount,
		type: 'POST',
		dataType: 'json',
		data: {
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
		success: function (data) {
			console.log('获取未读消息个数成功!-----');
			console.log(data);
			if (data.flag === 1) {
				if (data.data[0].noReadNum !== 0){

                    $('.noReadMessage-wrapper').show();

                    /* 如果未读消息数量 > 99 显示99 */
                    if (data.data[0].noReadNum >= 99) {
                        $('.noReadMessage').text('99');
                    }
                    else {
                        $('.noReadMessage').text(data.data[0].noReadNum);
                    }
				}
				else {
                    $('.noReadMessage-wrapper').hide();
				}
			}
		},
		error: function () {
			console.log('获取未读消息失败!');
		}
	});
}
getMessageCount();

/* 点击弹出框的 '确定' 关闭弹出框 */
$('.modal-button').on('click', function () {
	$('#myModal-error').modal('hide');
});

/* 只能输入数字 */
(function justNUmber () {
	$('.num-input').keydown(function(event) {
		var keys = ['Tab','Home','End','Backspace','Delete','ArrowLeft','ArrowRight','F12',' '];
		if (keys.indexOf(event.key) == -1) {
			if (/[^0-9]/g.test(event.key)) {
				event.preventDefault();
			}
		}
	});
	$('.num-input').keyup(function(event){
		$(this).val($(this).val().replace(/[^\d]/g,''));
	});
	$('.num-nput').on('paste', function() {
		var ptxt = arguments[0].originalEvent.clipboardData.getData('Text');
		$(this).val(ptxt.replace(/[^\d]/g,''));
	});
})();

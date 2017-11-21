$(function () {


	/* 点击 '取消' 关闭弹窗 */
	$('.modal-button-cancel').on('click', function () {
		$('#myModal').modal('hide');
	});

	/* 点击添加验证码 */
	$('.addfackcode-submit').on('click', function () {
		$('.addfackcode-error').text(''); //重置错误提示
		var number = $('[name="addfackcode"]').val(); //验证码数量
		if (number.length === 0) {
			$('.addfackcode-error').text('请输入验证码数量');
			return;
		}
		if (number === '0') {
			$('.addfackcode-error').text('验证码数量不能为0');
			return;
		}
		else {
			var count = 0;
			for (var i=0; i<number.length; ++i) {
				if (number[i] === '0') {
					++count;
				}
			}
			if (count === number.length) {
				$('.addfackcode-error').text('验证码数量不能为0');
				return;
			}

		}


		$('#myModal').modal('show');
		$('.errorInfo').text('确认要添加' + number + '个验证码吗?成功添加后可用验证码会自动扣除');

		/* 点击弹出框的 '确定' 开始添加验证码 */
		$('.modal-button').on('click', function () {
			$('.addfackcode-submit').addClass('addfackcode-process');
			$('.modal-button').unbind('click');
			$('#myModal').modal('hide');
			$.ajax({
					url: addTrace,
					type: 'POST',
					dataType: 'json',
					data: {
						tracearchivesid: getQueryString('tracearchivesid'),
						number: number,
						operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
						lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
					},
					success: function (data) {
						console.log('验证码添加成功!');
						console.log(data);
						if (data.flag === 1) {
							getEnterpriseInfoToTop();
							getFakeArchivesHistory();

							/* 清空输入框 */
							$('[name="addfackcode"]').val('');
						}
						if (data.flag === 0) {
							/* 可用验证码数量不足 */
							if (data.message.indexOf('不足以') > -1) {
								$('.addfackcode-error').text('可用验证码数量不足');

							}
							else {
								$('.addfackcode-error').text('验证码添加失败');
							}
						}
					},
					error: function () {
						console.log('添加验证码失败!');
					},
					complete: function () {
						$('.addfackcode-submit').removeClass('addfackcode-process');
					}
				});
		});

	});

	/* 获取产品相关信息 */
	getProductAboutInfo();

	/* 获取验证码历史 */
	getFakeArchivesHistory();
});



/* 获取产品相关信息 */
function getProductAboutInfo () {
	/* 获取从页面传过来的4个数据 */
	var product = JSON.parse(sessionStorage.getItem('product'));
	console.log('product');
	console.log(product);
	$('.addfackcode-image img').attr('src', product.picture);  //图片
	$('.addfackcode-text>span').eq(0).text(product.productionname); //名字
	$('.addfackcode-text>span').eq(1).text('发布时间: ' + product.createdate); //发布时间

}

/* 获取验证码历史 */
function getFakeArchivesHistory () {
	console.log('获取验证码历史!');
	$.ajax({
		url: fakeArchivesHistory,
		type: 'POST',
		dataType: 'json',
		data: {
			tracearchivesid: getQueryString('tracearchivesid'),
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
		success: function (data) {
			console.log('获取验证码历史成功!');
			console.log(data);
			if (data.flag === 1) {
				if (!data.data || !data.data[0]) return;
				if (data.data[0].beforeTimesCreated <= 1800) {
					data.data[0].createdate = '刚刚';
				}
				vue.fakeArchivesList = data.data;
			}
		},
		error: function () {
			console.log('获取验证码历史失败!');
		}
	});
}

var vue = new Vue({
	el: '#addfackcode-history',
	data: {
		fakeArchivesList: [] //验证码历史
	},
	methods: {
		/* 打印二维码 */
		printFakeArchives: function (fakeArchives) {
			//fakearchiveshistoryid: 2,
			console.log('打印验证码!');
			console.log(fakeArchives);
			window.open('print_fakeArchives.html?fakearchiveshistoryid=' + fakeArchives.id + '&tracearchivesid=' + fakeArchives.tracearchivesid);
		},
		/* 下载二维码 */
		downloadErweima: function (fakeArchives) {
			window.location.href =  downErweima + '?operatorid=' + JSON.parse(sessionStorage.getItem('loginInfo')).uid +
									'&lastlogincode=' + JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode +
									'&fakearchiveshistoryid=' + fakeArchives.id +
									'&tracearchivesid=' + fakeArchives.tracearchivesid;
		}
	}
});

$(function () {
	/* message */
	/* 左侧菜单鼠标滑入滑出 */
	$('.list-group-item:not(.account-safe)').hover(
		function () {
			$(this).css('background-color','#15b2ec');
			$(this).css('color','#FFF');
			/* 更换图片 */
			var text = $(this).children().eq(1).text();
			text.indexOf('消息') !== -1 ? text = '消息' : text = text;
			switch (text){
				case '报表统计':
					$(this).children().eq(0).attr('src','../img/zhuisu1.png');
					break;
				case '资料编辑':
					$(this).children().eq(0).attr('src','../img/bianji1.png');
					break;
				case '消息':
					$(this).children().eq(0).attr('src','../img/xiaoxi1.png');
					break;
			}
		},
		function () {
			if ($(this).hasClass('actived')) {
				return;
			}
			$(this).css('background-color','#FFF');
			$(this).css('color','#000');
			/* 更换图片 */
			var text = $(this).children().eq(1).text();
			text.indexOf('消息') !== -1 ? text = '消息' : text = text;
			switch (text){
				case '报表统计':
					$(this).children().eq(0).attr('src','../img/zhuisu.png');
					break;
				case '资料编辑':
					$(this).children().eq(0).attr('src','../img/bianji.png');
					break;
				case '消息':
					$(this).children().eq(0).attr('src','../img/xiaoxi.png');
					break;
			}
		}
	);
	$('.account-safe').hover(
		function (){
			$(this).css('color','#15b2ec');

		},
		function (){
			if ($(this).hasClass('text-actived')) {
				return;
			}
			$(this).css('color','#000');
		}
	);
	/* 点击菜单跳转 */
	$('.table-count,.account-safe,.message').click(function () {
		var text = $(this).children().text();
		text.indexOf('消息') !== -1 ? text = '消息' : text = text;
		switch (text){
			case '报表统计':
				window.location.href = 'government_home.html';
				break;
			case '账号安全':
				window.location.href = 'account_safe.html';
				break;
			case '消息':
				window.location.href = 'message.html';
				break;
		}
	});

	/* 获得消息列表 */
	getMessage();
});
/* 获取消息列表 */
function getMessage (currentPage) {
	currentPage = currentPage || 1;
	$.ajax({
		url: message,
		type: 'POST',
		data: {
			operatorid: 2,
			touserid: 2,
			pageSize: 5,
			currentPage: currentPage
		},
		dataType: 'json',
		success: function (data) {
			console.log('获取消息列表成功!');
			console.log(data);
			if (data.flag === 1) {
				console.log(data.data);
				vue.messageList = data.data;
				$('body,html').animate({ scrollTop: 0 },0);
				/* 分页 */
				$(".zxf_pagediv").createPage({
					pageNum: data.page.totalPage,//总页码
					current: data.page.currentPage,//当前页
					shownum: 7,//每页显示个数
					backfun: function(e) {
						e.current = e.current > e.pageNum ? e.pageNum : e.current;
						e.current = e.current < 1 ? 1 : e.current;
						getMessage(e.current);
						console.log(e);//回调
					}
				});
			}
		},
		error: function () {
			console.log('获取消息列表失败!');
		}
	});
}

var vue = new Vue({
	el: '.page-table',
	data: {
		messageList: [] //消息列表
	},

	methods: {
		/* 点击消息列表跳转 */
		clickMessageList: function () {
			console.log('点击了消息列表!');
			/* 跳转至产品详情页 */
			//window.location.href = '';
		}
	}
});

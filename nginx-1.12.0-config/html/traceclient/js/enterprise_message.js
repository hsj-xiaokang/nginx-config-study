/**
 * 会员首页
 */
$(function() {

	/* 获取消息列表 */
	getMessageList();

});


/* 获取消息列表 */
function getMessageList(currentPage) {
	currentPage = currentPage || 1;
	$.ajax({
		url: message,
		type: 'POST',
		dataType: 'json',
		data: {
			touserid: sessionStorage.getItem('enterpriseid'),
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode,
			currentPage: currentPage,
			pageSize: 5
		},
		success: function (data) {
			console.log('获取消息列表成功!');
			console.log(data);
			if (data.flag === 1) {
				data.page.totalPage = data.page.totalPage === 0 ? 1 : data.page.totalPage;
				vue.messageList = data.data;
				/* 分页 */
				$(".zxf_pagediv").createPage({
					pageNum: data.page.totalPage,//总页码
					current: data.page.currentPage,//当前页
					shownum: 7,//每页显示个数
					backfun: function(e) {
						e.current = e.current > e.pageNum ? e.pageNum : e.current;
						e.current = e.current < 1 ? 1 : e.current;
						getMessageList(e.current);
						console.log(e);//回调


					}
				});
				/* 获取未读消息数量 */
				getMessageCount();
			}
		},
		error: function () {
			console.log('获取消息列表失败!');
		}
	})
}

var vue = new Vue({
	el: '#message-body',
	data: {
			messageList: []  //消息列表
	},
	methods: {
		/* 点击消息列表跳转 */
		clickMessageList: function (traceid) {
			console.log('traceid = ');
			console.log(traceid);
			sessionStorage.setItem('pagePath',$('#current-page').text()); //当前导航存入session
			/* 跳转至产品详情页 */
			window.location.href = '../trace_archive.html?id=' + traceid;
		}
	}
});




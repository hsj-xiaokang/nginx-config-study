/* index */
$(function () {
	/* 右侧导航页面位置设置 */
	$('#menu').css('left',$(document.body).width() - 60);
	$('#menu>li:first-child').css('margin-top',($(document.body).height()-390) / 4);
	$(window).resize(function () {
		$('#menu').css('left',$(document.body).width() - 60);
		$('#menu>li:first-child').css('margin-top',($(document.body).height() - 390) / 4);
	});

	/* 查询验证码 */
	$('#section1-button').on('click',function () {
		searchTrace();
	});
	// 回车键事件
	$(document).keydown(function(e) {
		if(e.which == 13){
			searchTrace();
		}
	});


		/* 广告列表 */
	$.ajax({
		url: advert,
		type: 'POST',
		dataType: 'json',
		success: function (data){
			$('.section2-wrapper').show();
			if (data.flag === 1) {
				data.data = data.data.length > 3 ? data.data.slice(0, 3) : data.data;
				/**
				 * Vue
				 */
				new Vue({
					el: '.section2',
					data: function (){
						return {
							adverts: []
						}
					},
					mounted: function (){
						this.adverts = data.data;
					},
					methods: {
						/* 点击广告上的产品跳转到产品档案 */
						clickProduct: function (id){
							console.log('id = ' + id);
							window.location.href = 'trace_archive.html?id=' + id;
						}
					}
				});
			}
			else {}
		},
		error: function (){
			console.log('error!');
			$('.section2-wrapper').hide();
		}
	});

	/* 首页添加访问记录 */
	$.ajax({
		url: visitTake,
		success: function (data) {
			console.log(data);
		},
		error: function (){
			console.log('添加访问记录失败!');
		}
	})

});

/* 查询验证码 */
function searchTrace () {
	$('.section1-error').text('').hide();
	/* 检测数据合法性 */
	var inputLength = $('#section1-input').val().length || 0;
	if (inputLength === 0) {
		$('.section1-error').text('追溯码或者验证码不能为空').show();
		return;
	}
	if (inputLength < 15) {
		$('.section1-error').text('追溯码或者验证码为15位或者18位').show();
		return;
	}
	/* 查询验证码 */ /* ? 1.只能输入数字 2.查询结果未返回时禁止再次点击查询 */
	$.ajax({
		url: searchFackCode,
		type: "POST",
		dataType: "json",
		data: {traceNoOrFakeNo: $('#section1-input').val()},
		success: function(data) {
			console.log(data);
			/* ok */
			if (data.flag === 1) {
				console.log('查询成功!');
				console.log(data.data);
				/* 跳转至追溯产品详情页 */
				sessionStorage.setItem('pagePath', '首页'); //当前导航存入session
				window.location.href = './trace_archive.html?&id=' + data.data.id + '&scantimes=' + data.data.scantimes;
			}
			/* 15位 找不到此追溯码 */
			if (inputLength === 15 && data.flag === 0) {
				$('.section1-error').text('找不到此追溯码的产品').show();
			}
			/* 18位 找不到此追溯码 */
			if (inputLength === 18 && data.flag === 0) {
				$('.section1-error').text('找不到此验证码的产品').show();
			}
		},
		error: function(result) {
			$('.section1-error').text('服务异常').show();
		},
	});
}
/* 全屏滚动 */
$('#dowebok').fullpage({
	anchors: ['page1', 'page2', 'page3', 'page4', 'page5'],
	menu: '#menu'
});







/* 基本信息 */
$(function () {
	/* 图片放大 */
	$('.enterpriseNatural-image').hover(
		function () {
			$(this).parent().append("<img src='"+this.src+"' id='pic'>");
			$(this).mousemove(function(e){
				$("#pic").css({
					/*"top":(e.pageY+10)+"px",
					"left":(e.pageX-500)+"px"*/
				}).fadeIn("fast");
				// $("#pic").fadeIn("fast");
			});
		},
		function () {
			$("#pic").remove();
		}
	);

	/* 获取企业资质列表 */
	getNaturalList();

});

/* 获取企业资质列表 */
function getNaturalList() {
	console.log('获取企业资质!');
	console.log('enterpriseid');
	$.ajax({
		url: getNatural,
		type: 'POST',
		dataType: 'json',
		data: {
			enterpriseid: sessionStorage.getItem('enterpriseid'),
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
		success: function (data) {
			console.log('获取企业资质列表成功!');
			console.log(data);
			if (data.flag === 1){
				vue.enterpriseNaturalList = data.data;
			}
		},
		error: function () {
			console.log('获取企业资质列表失败!');
		}
	});

}


var vue = new Vue({
	el: '#company-natural-body',
	data: {
		enterpriseNaturalList: [] //企业资质列表
	},
	methods: {
		/* 点击删除图标 */
		deleteNatural: function (enterpriseid, enterpriseQualificationsId) {
			console.log('删除!');
			console.log(enterpriseid);
			console.log(enterpriseQualificationsId);
			$.ajax({
				url: deleteNatural,
				type: 'POST',
				dataType: 'json',
				data: {
					enterpriseid: enterpriseid,
					enterpriseQualificationsId: enterpriseQualificationsId,
					operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
					lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
				},
				async: false,
				success: function (data) {

					if (data.flag === 1) {
						getNaturalList();
					}
				},
				error: function () {
					console.log('删除失败!');
				}
			});
		},

		/* 修改企业资质 */
		uploadImage: function (enterpriseid, enterpriseQualificationsId) {
			window.open('upload_image.html?enterpriseid=' + enterpriseid + '&enterpriseQualificationsId=' + enterpriseQualificationsId);
		}
	}
});

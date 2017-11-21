/* company_info */
$(function (){
	/* 获取头部企业相关信息 */
	getEnterpriseInfoToTop();

	/* 获取企业信息 */
	getEnterpriseInfo();

	/* 设置路径导航用户中心地址 */
	if (sessionStorage.getItem('loginInfo')) {
		$('#breadcrumb a:last-child').attr('href', './enterprise/member_home.html');
	}

});


/* 获取企业信息 */
function getEnterpriseInfo () {
	console.log('获取企业信息');
	$.ajax({
		url: enterpriseInfo,
		type: 'POST',
		dataType: 'json',
		data: {
			enterpriseid: getQueryString('enterpriseid')
		},
		success: function (data){
			console.log('获取企业信息成功!11');
			console.log(data);
			setPageData(data.data);
		},
		error: function (){
			console.log('失败!');
		}
	});

}

/* 获取头部企业相关信息 */
function getEnterpriseInfoToTop() {
	var data = {};
	data.enterpriseid = getQueryString('enterpriseid');
	if (sessionStorage.getItem('loginInfo')) {
		data.operatorid = JSON.parse(sessionStorage.getItem('loginInfo')).uid;
		data.lastlogincode = JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode;
	}
	$.ajax({
		url: enterpriseInfo,
		type: 'POST',
		dataType: 'json',
		data: data,
		success: function (data) {
			console.log('获取企业logo、name成功!');
			console.log(data);
			if (data.flag === 1) {
				console.log(data);
				$('.logo-name img').attr('src', data.data.logoURL);
				$('.logo-name span').text(data.data.enterprisename);
				$('.enterprise-num>span>span').eq(1).text(data.data.unusedfakenumber);
				$('.enterprise-num>span span').eq(2).text(data.data.usedfakenumber);
			}
		},
		error: function () {
			console.log('获取企业logo、name失败!');
		}
	});
	$.ajax({
		url: productionCount,
		type: 'POST',
		dataType: 'json',
		data: data,
		success: function (data) {
			console.log('获取已发布产品数量成功!');
			console.log(data);
			if (data.flag === 1) {
				$('.enterprise-num>span>span').eq(0).text(data.data.totalCount);
			}
		},
		error: function () {
			console.log('获取已发布产品数量失败!');
		}
	})
}

/* 设置页面数据 */
function setPageData (data) {
	console.log('......');
	$('#table-enterpriseInfo tr').eq(0).children().eq(1).text(data.enterprisename);
	$('#table-enterpriseInfo tr').eq(1).children().eq(1).text(data.addressDetail);
	$('#table-enterpriseInfo tr').eq(2).children().eq(1).text(data.owner);
	$('#table-enterpriseInfo tr').eq(3).children().eq(1).text(data.enterprisephone);
	$('#table-enterpriseInfo tr').eq(4).children().eq(1).text(data.enterpriseprofile);
	$('#table-enterpriseInfo tr').eq(5).children().eq(1).text(data.scope);
	$('#table-enterpriseInfo tr').eq(6).children().eq(1).text(data.serviceinformation);
	$('.company-menu a').eq(1).attr('href','enterprise_product.html?enterpriseid=' + data.enterpriseid);
}


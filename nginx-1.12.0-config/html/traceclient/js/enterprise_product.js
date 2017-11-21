/* company_info */
$(function (){

	/* 禁用enter键表单自动提交 */
	prohibitFormDefaultSubmit();

	/* 获取头部企业相关信息 */
	getEnterpriseInfoToTop();

	/* 获取产品类型列表 */
	getProductTypeList();

	/* 获取企业的全部产品 */
	getEnterpriseAllProduct();

	/* 点击 '搜索' */
	$('#search-button').on('click', function () {
		getEnterpriseAllProduct();
	});

	/* 类型列表项改变 */
	$('#products-search-select').on('change', function () {
		getEnterpriseAllProduct();
	});

	// 回车键事件
	$(document).keydown (function (e) {
		if (e.which == 13 && $('.products-name-div input').is(':focus')) {
			getEnterpriseAllProduct();
		}
	});

	/* 设置企业首页地址 */
	$('.company-menu a').eq(0).attr('href', 'enterprise_index.html?enterpriseid=' + getQueryString('enterpriseid'));

	/* 设置路径导航用户中心地址 */
	if (sessionStorage.getItem('loginInfo')) {
		$('#breadcrumb a:last-child').attr('href', './enterprise/member_home.html');
	}

});

/* 获取产品类型列表 */
function getProductTypeList () {
	console.log('获取产品类型列表!');
	$.ajax({
		url: productTypeList,
		type: 'POST',
		dataType: 'json',
		data: {operatorid: 2},
		success: function (data){
			console.log('获取产品类型列表成功!');
			console.log(data);
			if (data.flag === 1) {
				var template = '<option value="">全部</option>';
				for (var productType of data.data) {
					template += '<option value="'+productType.code+'">'+productType.typeName+'</option>'
				}
				$('#products-search-select').html(template);
			}
		},
		error: function (){
			console.log('失败!');
		},
	});
}

/* 获取企业的全部产品 */
function getEnterpriseAllProduct(currentPage) {

	var data = {};
	data.enterpriseid = getQueryString('enterpriseid');
	data.type = $('#products-search-select').val(); //类型
	data.productionname = $('#products-name-div input').val(); //名字
	data.currentPage = currentPage || 1;
	data.pageSize = 12;

	if  (sessionStorage.getItem('loginInfo')) {
		data.operatorid = JSON.parse(sessionStorage.getItem('loginInfo')).uid;
		data.lastlogincode = JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode;
	}
	$.ajax({
		url: allProductionByEnterprise,
		type: 'POST',
		dataType: 'json',
		/*data: {
			enterpriseid: getQueryString('enterpriseid'),
			type: $('#products-search-select').val(), //类型
			productionname: $('#products-name-div input').val(), //名字
			currentPage: currentPage,
			pageSize: 12,
			operatorid: operatorid,
			lastlogincode: lastlogincode
		},*/
		data: data,
		success: function (data){
			console.log('获取企业的全部产品成功!');
			console.log(data);
			if (data.flag === 1) {
				data.page.totalPage = data.page.totalPage === 0 ? 1 : data.page.totalPage;
				vue.enterpriseProductList = data.data;
				$('body,html').animate({ scrollTop: 0 },0);
				/* 分页 */
				$(".zxf_pagediv").createPage({
					pageNum: data.page.totalPage,//总页码
					current: data.page.currentPage,//当前页
					shownum: 7,//每页显示个数
					backfun: function(e) {
						e.current = e.current > e.pageNum ? e.pageNum : e.current;
						e.current = e.current < 1 ? 1 : e.current;
						getEnterpriseAllProduct(e.current);
						console.log(e);//回调
					}
				});
			}

		},
		error: function (){
			console.log('失败!');
		}
	});

}

/* 获取头部企业相关信息 */
function getEnterpriseInfoToTop() {
	var data = {};
	if (!sessionStorage.getItem('loginInfo')) {
		data.enterpriseid = getQueryString('enterpriseid');
	}
	else {
		data.enterpriseid = getQueryString('enterpriseid');
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


var vue = new Vue({
	el: '.products-list-wrapper',
	data: {
		enterpriseProductList: [] //企业下面的全部产品
	},
	methods: {
		clickProduct: function (id) {
			sessionStorage.setItem('pagePath',$('#current-page').text()); //当前导航存入session
			window.location.href = 'trace_archive.html?id=' + id;
		}
	}
});

/* 禁用enter键表单自动提交 */
function prohibitFormDefaultSubmit  () {
	document.onkeydown = function(event) {
		var target, code, tag;
		if (!event) {
			event = window.event; //针对ie浏览器
			target = event.srcElement;
			code = event.keyCode;
			if (code == 13) {
				tag = target.tagName;
				if (tag == "TEXTAREA") { return true; }
				else { return false; }
			}
		}
		else {
			target = event.target; //针对遵循w3c标准的浏览器，如Firefox
			code = event.keyCode;
			if (code == 13) {
				tag = target.tagName;
				if (tag == "INPUT") { return false; }
				else { return true; }
			}
		}
	};
}

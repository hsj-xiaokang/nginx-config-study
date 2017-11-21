/**
 * 会员首页
 */

$(function(){	


	/* 选择日期插件初始化 */
	var dateStart = $('#start').datetimepicker({
		format: 'yyyy-mm-dd', //显示格式
		minView: 'month', //
		language: 'zh-CN', //语言
		autoclose: true, //选择一个日期之后是否立即关闭该选择器
		weekStart: 1 //一周从哪天开始

	});
	dateStart.on('change', function (){
		$('#end').datetimepicker('setStartDate',$('#start').val())
	});
	var dateEnd = $('#end').datetimepicker({
		format: 'yyyy-mm-dd',
		minView: 'month',
		language: 'zh-CN',
		autoclose: true,
		weekStart: 1
	});
	dateEnd.on('change', function (){
		$('#start').datetimepicker('setEndDate',$('#end').val());
	});
	/* 新建追溯档案展开部分 鼠标移入移出样式改变 */
	$('#back-text-out').hover(
		function (){
			$(this).css('border', '1px solid #15b2ec');
		},
		function (){
			$(this).css('border', '1px solid #CCC');
		}
	);
	/* 新建追溯档案点击展开 */
	$('#back-text').click(function (){
		$('#back-text-out').show();
		$(this).hide();
		/* 获取农产品类型列表 */
		findSunProductTypeList(1);
	});
	/* 点击取消隐藏展开的部分 显示新建追溯档案 */
	$('.last-submit-button>button:last-child').click(function (){
		$('#back-text-out').hide();
		$('#back-text').show();
	});

	/* 菜单鼠标进出 */
	$('.menu-edit,.menu-message').hover(
		function () {
			$(this).css('background-color','#15b2ec');
			$(this).find('a').css('color','#FFF');
			if ($(this).find('a').text() === '资料编辑'){
				$(this).css('background-image','url(../img/enterprise/home/bianji1.png)')
			}
			if ($(this).find('a').text().indexOf('消息') > -1){
				$(this).css('background-image','url(../img/enterprise/home/xiaoxi1.png)')
			}
		},
		function () {
			$(this).css('background-color','#f5f7fa');
			$(this).find('a').css('color','#000');
			if ($(this).find('a').text() === '资料编辑'){
				$(this).css('background-image','url(../img/enterprise/home/bianji.png)');
			}
			if ($(this).find('a').text().indexOf('消息') > -1){
				$(this).css('background-image','url(../img/enterprise/home/xiaoxi.png)');
			}
		}
	);
	$('.menu-back-files').css('background-image','url(../img/enterprise/home/zhuisu1.png)');

	/* 新建追溯档案 鼠标进出 */
	$('#back-text').hover(
		function () {
			$(this).css('border','1px solid #15b2ec');
		},
		function () {
			$(this).css('border','1px dashed #CCC');
		}
	);



	/* 即时查询 */
	$('.select-type,.select-status,#start,#end').on('change', function () {
		console.log('改变了!');
		getProductList();
	});
	$('.search-product').on('click', function () {
		getProductList();
	});

	/* 敲击回车 */
	$(document).keydown(function(e) {
		if(e.which == 13 && $('.back-input input').is(":focus")){
			getProductList();
		}
	});

	/* 获取产品类型列表 */
	getProductTypeList();
	/* 获取审核状态列表 */
	getStatusList();
	/* 获取追溯档案列表*/
	getProductList();

});



/* 获取产品类型列表 */
function getProductTypeList () {
	$.ajax({
		url: productTypeList,
		type: 'POST',
		dataType: 'json',
		data: {
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
		success: function (data){
			if (data.flag === 1) {
				console.log('产品分类:');
				console.log(data);
				/*  */
				var template = '<option value="">全部</option>';
				var anotherTemplate = '';
				for (var productType of data.data) {
					template += '<option value="'+productType.code+'">'+productType.typeName+'</option>';
					anotherTemplate += '<li id="'+productType.code+'" onclick="findSunProductTypeList('+productType.code+')">'+productType.typeName+'</li>'
				}
				$('.select-type').html(template);
				$('.nav-tabs').html(anotherTemplate);
			}
			else{}
		},
		error: function (){
			console.log('失败!');
		}
	});

}

/* 获取审核状态列表 */
function getStatusList () {
	$.ajax({
		url: statusList,
		type: 'POST',
		dataType: 'json',
		data: {
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
		success: function (data) {
			console.log('获取审核状态成功!');
			console.log(data);
			if (data.flag === 1) {
				var template = '';
				for (var status of data.data) {
					template += ' <option value="'+status.dictvalue+'">'+status.dictname+'</option>';
				}
				$('.select-status').html(template);
			}
		},
		error: function () {
			console.log('获取审核状态失败!');
		}
	})
}

/* 获取追溯档案列表 */
function getProductList(currentPage) {
	currentPage = currentPage || ''; //当前页
	var type = $(".select-type").val(); //产品类型
	var status = $(".select-status").val(); //审核状态
	var createDateBegin = $('#start').val(); //开始时间
	var createDateEnd = $('#end').val(); //结束时间
	var productionname = $('#back-input input').val(); //产品名称
	console.log('产品类型:'+type);
	console.log('审核状态:'+status);  //审核状态 通过接口获取 未做
	console.log('开始时间:'+createDateBegin); // ?
	console.log('结束时间:'+createDateEnd); // ?
	console.log('产品名称:'+productionname);

	$.ajax({
		url: productList,
		type: 'POST',
		dataType: 'json',
		data: {
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode,
			enterpriseid: sessionStorage.getItem('enterpriseid'),
			type: type,
			status: status,
			createDateBegin: createDateBegin,
			createDateEnd: createDateEnd,
			productionname: productionname,
			currentPage: currentPage,
			pageSize: 5

		},
		success: function (data){
			console.log('获取产品列表成功!');
			console.log(data);
			if (data.flag === 1) {
				$('#back-list-wrapper').show();
				data.page.totalPage = data.page.totalPage === 0 ? 1 : data.page.totalPage;
				vue.productList = handleProductArr(data.data);
				$('body,html').animate({ scrollTop: 0 },0);
				/* 分页 */
				$(".zxf_pagediv").createPage({
					pageNum: data.page.totalPage,//总页码
					current: data.page.currentPage,//当前页
					shownum: 7,//每页显示个数
					backfun: function(e) {
						e.current = e.current > e.pageNum ? e.pageNum : e.current;
						e.current = e.current < 1 ? 1 : e.current;
						getProductList(e.current);
						console.log(e);//回调
					}
				});
			}
		},
		error: function (){
			console.log('获取表格数据失败!');
		}

	})
}

/* 点击企业名称查看企业信息 */
function clickCompany (id){
	window.location.href = 'enterprise_product.html';
}

/* 点击父级分类 查询子级分类 */
var parentCode = 0; //父级分类编号
var sunCode = 0; //子级分类编号
function findSunProductTypeList (code){
	$('#' + code).addClass('nav-tabs-active');
	$('#' + code).siblings().removeClass('nav-tabs-active');
	parentCode = code;
	sunCode = 0;
	console.log('父级: = ' +code);
	var code = code || '';
	$.ajax({
		url: sunProductTypeList,
		type: 'POST',
		dataType: 'json',
		data: {
			parentCode: code, operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
		success: function (data){
			console.log('success!');
			console.log('子级分类:');
			if (data.flag === 1) {
				console.log(data.data);
				var template = '';
				for (var sunProductType of data.data) {
					template += '<span id="'+sunProductType.code+'" onclick="clickSunProductType('+sunProductType.code+')" >'+sunProductType.typeName+'</span>'
				}
				$('.about-product').html(template);
			}
		},
		error: function (){
			console.log('error!');
		}
	});
}

/* 点击子级分类 */
function clickSunProductType(code) {
	sunCode = code;
	console.log('点击子级');
	$('#' + code).css('border-color','#15b2ec').css('color', '#15b2ec');
	$('#' + code).siblings().css('border-color','#cacbd0').css('color', '#333333');
}

/* 点击新建 */
function newProduct() {
	if (!parentCode || !sunCode) {
		commonAlert('请选择产品种类');
		return;
	}

	/* 查询企业审核状态 */
	$.ajax({
		url: enterpriseInfo,
		type: 'POST',
		dataType: 'json',
		data: {
			enterpriseid: sessionStorage.getItem('enterpriseid'),
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
		success: function (data) {
			console.log(data);
			if (data.flag === 1) {
				if (data.data.status === 2 && data.data.deleted !== 1) { // 企业审核通过
					window.location.href = 'new_product.html?type=' + parentCode + '&secondtype=' + sunCode;
				}
				else { // 企业 不是 正常状态

					if (data.data.deleted === 1) {
						commonAlert('企业已删除');
					}
					else {
						commonAlert('企业' + data.data.auditstatus);
					}
				}
			}
		},
		error: function () {
			console.log('查询企业审核状态!');
		}
	});
}


/* 计算时间 */
function handleProductArr (productArr) {
	var lastTime = ''; //上一次时间
	if (!productArr) return;
	for (var i=0; i<productArr.length; ++i) {
		var time = productArr[i].createdate.substr(0,10);
		console.log(time);
		if (time != lastTime) {
			productArr[i].captionTime = {
				time: time,
				isShow: true
			}
		}
		if (time == lastTime) {
			productArr[i].captionTime = {
				time: time,
				isShow: false
			}
		}
		lastTime = time;
	}
	return productArr;
}

var vue = new Vue({
	el: '#back-list-wrapper',
	data: {
		productList: [] //产品类型
	},
	methods: {
		/* 添加追溯码 */
		addFackCode: function (product) {
			console.log('添加追溯码');
			console.log(product);
			sessionStorage.setItem('product', JSON.stringify(product));
			window.location.href = 'addfackcode.html?tracearchivesid=' + product.id;

		},
		/* 打印 */
		putFackCode: function (id) {
			console.log('打印防伪码');
			console.log(id);
			window.open('put_trace.html?id=' + id);
		},
		/* 点击产品图片或产品文字跳转到详情页 */
		clickProduct: function (id){
			sessionStorage.setItem('pagePath',$('#current-page').text()); //当前导航存入session
			console.log(id);
			window.location.href = '../trace_archive.html?id='+id;
		}
	}
});





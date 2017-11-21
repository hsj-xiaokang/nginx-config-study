
$(function (){
	/* 点击图标显示报表统计 */
	$('.caption-icon').click(function (){
		window.location.href = 'graph_statistics.html?type=' + $(this).attr('data-type');
	});

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
	/* 点击 '清除' */
	$('.clear-option').on('click', function () {
		$('#form-wrapper')[0].reset();
        getTableData();
        getTraceAllNumber();
	});

	/* 点击 '导出' */
	$('.table-out').on('click', function () {
		console.log('导出!');
		window.location.href = FromUserCenter + '?operatorid=' + JSON.parse(sessionStorage.getItem('loginInfo')).uid + '&lastlogincode=' + JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode;

	});

	/* 点击 '查询' */
	$('.search').on('click',function () {
		getTableData();
	});
	/* 敲击回车 */
	$(document).keydown(function(e) {
		if(e.which == 13 && $('.company-name').is(":focus")){
			getTableData();
		}
	});


	/* 获取省份 */
	$.ajax({
		url: address,
		type: 'POST',
		dataType: 'json',
		data: {
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
		success: function (data){
			console.log('获取省份地址成功!');
			console.log(data);
			if (data.flag === 1) {
				var provinceHtml = '<option value="">--请选择--</option>'  //省份
				for (var province of data.data) {
					provinceHtml += '<option value="'+province.code+'">'+province.name+'</option>'
				}
				$('.address-province').html(provinceHtml);
			}

		},
		error: function (){
			console.log('获取省份地址失败!');
		}
	})
	
	/* 省份值改变时获取市 */
	$('.address-province').change(function () {
		if ($(this).val() === '') return;
		/* 获取省份 */
		var code = $('.address-province').val();
		$.ajax({
			url: address,
			type: 'POST',
			dataType: 'json',
			data: {
				parentcode: code,
				operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
				lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
			},
			success: function (data){
				console.log('获取市地址成功!');
				console.log(data);
				if (data.flag === 1) {
					var cityHtml = '<option value="">--请选择--</option>'  //省份
					for (var city of data.data) {
						cityHtml += '<option value="'+city.code+'">'+city.name+'</option>'
					}
					$('.address-city').html(cityHtml);
				}
			},
			error: function (){}
		})

	});

	/* 获取数据 - 今天 昨天 */
	getNowData();

	/* 获取产品类型列表 */
	getProductTypeList();

	/* 获取有无防伪码列表 */
	getFackCodeList();

	/* 获取排列方式列表 */
	getSortWayList();

	/* 获取表格数据 */
	getTableData();

    /* 获取企业、档案、防伪的数量 */
    getTraceAllNumber();

	/* 及时查询 */
	$('.address-province,.address-city,.product-type,.security-code,#date-start,#date-end,.sort-way').on('change', function () {
		console.log('及时查询!');
		getTableData();
		getTraceAllNumber();
	});

});


/* 获取今天 昨天 的数据 */
function getNowData () {
	$.ajax({
		url: staticTime,
		type: 'POST',
		dataType: 'json',
		data: {
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
		success: function (data){
			console.log('获取今天的数据成功!');
			console.log(data);
			if (data.flag === 1) {
				$('.now').eq(0).text(data.data.today.pageViewNum);
				$('.now').eq(1).text(data.data.today.enterpriseNum);
				$('.now').eq(2).text(data.data.today.archivesNum);
				$('.now').eq(3).text(data.data.today.fakearchivesNum);

				$('.yesterday').eq(0).text(data.data.yesterday.pageViewNum);
				$('.yesterday').eq(1).text(data.data.yesterday.enterpriseNum);
				$('.yesterday').eq(2).text(data.data.yesterday.archivesNum);
				$('.yesterday').eq(3).text(data.data.yesterday.fakearchivesNum);
			}
		},
		error: function (){
			console.log('获取今天的数据失败!');
		}
	});
}


/* 获取排序方式列表 */
function getSortWayList () {
	$.ajax({
		url: sortWay,
		type: 'POST',
		data: {
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
		dataType: 'json',
		success: function (data) {
			console.log('获取排序方式列表成功');
			console.log(data);
			if (data.flag === 1){
				var template = '';
				for (var sortWay of data.data) {
					template += ' <option value="'+sortWay.dictvalue+'">'+sortWay.dictname+'</option>';
				}
				$('.sort-way').html(template);
			}
		},
		error: function () {
			console.log('获取排序方式列表失败');
		}
	})
}

/* 获取产品类型列表 */
function getProductTypeList () 	{
	$.ajax({
		url: productTypeList,
		type: 'POST',
		dataType: 'json',
		data: {
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
		success: function (data){
			console.log('获取产品类型列表成功');
			console.log(data);
			if (data.flag === 1) {
				var template = '<option class="first-option" value="">全部</option>';
				for (var productType of data.data) {
					template += '<option class="first-option" value="'+productType.code+'">'+productType.typeName+'</option>';
				}
				$('.product-type').html(template);
			}
		},
		error: function (){
			console.log('获取产品类型列表失败!');
		},
	});
}

/* 获取有无防伪码列表 */
function getFackCodeList () {
	$.ajax({
		url: dictByHaveCreateFake,
		type: 'POST',
		data: {
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
		dataType: 'json',
		success: function (data) {
			console.log('获取有无防伪码列表成功!');
			console.log(data);
			if (data.flag === 1){
				var template = '';
				for (var fakeCode of data.data) {
					template += '<option value="'+fakeCode.dictvalue+'">'+fakeCode.dictname+'</option>'
				}
				$('.security-code').html(template);
			}
		},
		error: function () {
			console.log('获取有无防伪码列表失败!');
		}
	});
}

/* 获取表格数据 */
function getTableData(currentPage) {
	currentPage = currentPage || 1;
	var productionPositionCode = $('.address-city').val() || $('.address-province').val() || '';  //地址
	var type = $('.product-type').find('option:selected').text() === '全部' ? '' : $('.product-type').find('option:selected').text(); //类型
	var haveCreateFake = $('.security-code').val(); //有无防伪码
	var createdatestart = $('#date-start').val(); //起止时间
	var createdateend = $('#date-end').val(); //截止时间
	var orderBy =  $('.sort-way').val();//排列方式
	var enterpriseNameOrProductionName = $('.company-name').val(); //企业名称
	console.log('地址:'+productionPositionCode);
	console.log('类型:'+type);
	console.log('有无防伪码:'+haveCreateFake);
	console.log('起止时间:'+createdatestart);
	console.log('截止时间:'+createdateend);
	console.log('排列方式:'+orderBy);
	console.log('企业名称:'+enterpriseNameOrProductionName);
	$.ajax({
		url: tableData,
		type: 'POST',
		dataType: 'json',
		data: {
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode,
			productionPositionCode: productionPositionCode,
			type: type,
			haveCreateFake: haveCreateFake,
			createdatestart: createdatestart,
			createdateend: createdateend,
			orderBy: orderBy,
			enterpriseNameOrProductionName: enterpriseNameOrProductionName,
			currentPage: currentPage
		},
		success: function (data){
			console.log('获取表格数据成功!');
			console.log(data);
			if (data.flag === 1) {
				vue.tableData = data.data;
				/* 分页 */
				$(".zxf_pagediv").createPage({
					pageNum: data.page.totalPage,//总页码
					current: data.page.currentPage,//当前页
					shownum: 7,//每页显示个数
					backfun: function(e) {
						e.current = e.current > e.pageNum ? e.pageNum : e.current;
						e.current = e.current < 1 ? 1 : e.current;
						getTableData(e.current);
						console.log(e);//回调
					}
				});
			}
		},
		error: function (){
			console.log('获取表格数据失败!');
		}
	});
}

/* 汇总企业、档案、防伪的数量 */
function getTraceAllNumber () {
    var productionPositionCode = $('.address-city').val() || $('.address-province').val() || '';  //地址
    var type = $('.product-type').find('option:selected').text() === '全部' ? '' : $('.product-type').find('option:selected').text(); //类型
    var haveCreateFake = $('.security-code').val(); //有无防伪码
    var createdatestart = $('#date-start').val(); //起止时间
    var createdateend = $('#date-end').val(); //截止时间
    var orderBy =  $('.sort-way').val();//排列方式
    var enterpriseNameOrProductionName = $('.company-name').val(); //企业名称
    $.ajax({
        url: traceAllNumber,
        type: 'POST',
        dataType: 'json',
        data: {
            operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
            lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode,
            productionPositionCode: productionPositionCode,
            type: type,
            haveCreateFake: haveCreateFake,
            createdatestart: createdatestart,
            createdateend: createdateend,
            orderBy: orderBy,
            enterpriseNameOrProductionName: enterpriseNameOrProductionName,
        },
        success: function (data){
			console.log('获取汇总企业、档案、防伪的数量成功!');
			console.log(data);
			if (data.flag === 1) {

				if (!data.data.enterpriseQuantity) data.data.enterpriseQuantity = 0;
				if (!data.data.traceArchivesQuantity) data.data.traceArchivesQuantity = 0;
				if (!data.data.securityTraceArchivesQuantity) data.data.securityTraceArchivesQuantity = 0;

				$('.enterpriseQuantity').text(data.data.enterpriseQuantity); //企业数
				$('.traceArchivesQuantity').text(data.data.traceArchivesQuantity); //追溯档案数
				$('.securityTraceArchivesQuantity').text(data.data.securityTraceArchivesQuantity); //防伪档案数
			}
        },
        error: function (){
            console.log('获取汇总企业、档案、防伪的数量失败!');
        }
    });
}

/* Vue */
var vue = new Vue({
	el: '.table',
	data: {
		tableData: [] //表格数据
	},
	methods: {
		/* 点击二维码展开图片 */
		openImage: function (path) {
			window.open(path);
		}
	}
});

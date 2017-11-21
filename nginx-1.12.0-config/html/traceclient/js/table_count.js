/* form_count */
$(function (){
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
				window.location.href = 'table_count.html';
				break;
			case '账号安全':
				window.location.href = 'account_safe.html';
				break;
			case '消息':
				window.location.href = 'message.html';
				break;
		}


	});
	/* 点击播放图标 */
	$('.caption-up img').click(function () {
		$('.page-table').hide();
		$('.page-chart').show();
	});
	
	/* 点击图标显示报表统计 */
	$('.caption-icon').click(function (){
		var type = $(this).attr('data-type');
		/* 1.获取数据 */
		var mtData = []; //数据
		$.ajax({
			url: visitCount,
			type: 'POST',
			dataType: 'json',
			data: {type: type, day: 7, operatorid: 2},
			async: false,
			success: function (data){
				console.log('ok!');
				console.log(data);
				if (data.flag === 1) {
					myData = data.data;
				}
			},
			error: function (){
				console.log('no!');
			}
		})
		/* 2. 绘图 */
		var labels = []; /* x轴数据 */
		var value = []; /* y轴value */
		for (var data of myData) {
			labels.push(data.key);
			value.push(data.value);
		}
		
		var data = [
			{
				//value:[20,50,20,10,30,25,12],
				value: value,
				color:'#90b474',
				line_width:1
			}
		];
		var chart = new iChart.Area2D({
			render : 'canvasDiv',
			data: data,
			width : 800,
			height : 350,
			animation: true, //开启动画
			sub_option:{ //折线段配置
				//hollow_inside:false,//设置一个点的亮色在外环的效果
				smooth: true, //平滑曲线
	 			//label:false, //不显示数据
				point_size:0
			},
			/* 十字线配置 */
			crosshair:{
				enable:true,
				line_color:'#90b474',
				line_width:1,
			},
			tip:{
				enable : true,
				listeners:{
					//tip:提示框对象、name:数据名称、value:数据值、text:当前文本、i:数据点的索引
					parseText:function(tip,name,value,text,i){
						return labels[i]+ "<br/>浏览量:" + value + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
					}
				}
			},
			labels:labels
		});
		chart.draw();
	});


	/* 进入报表统计页面 点击8个按钮 */
	var day = 7; //时间
	var type = 1; //类型
	$('.page-chart li,.chart-button span').click(function (){
		var myData = [];
		switch ($(this).text()) {
			case '最近7天' :
				$(this).css('color','#4ac145').css('border','1px solid #4ac145');
				$(this).siblings().css('color','#000').css('border','1px solid #FFF');
				day = 7;
				break;
			case '最近30天' :
				$(this).css('color','#4ac145').css('border','1px solid #4ac145');
				$(this).siblings().css('color','#000').css('border','1px solid #FFF');
				day = 31;
				break;
			case '最近90天' :
				$(this).css('color','#4ac145').css('border','1px solid #4ac145');
				$(this).siblings().css('color','#000').css('border','1px solid #FFF');
				day = 89;
				break;
			case '最近半年' :
				$(this).css('color','#4ac145').css('border','1px solid #4ac145');
				$(this).siblings().css('color','#000').css('border','1px solid #FFF');
				day = 180;
				break;
			case '浏览量' :
				$(this).css('color','#FFF').css('background-color','#CCC');
				$(this).siblings().css('color','#000').css('background-color','#FFF');
				type = 1;
				break;
			case '企业入驻数' :
				$(this).css('color','#FFF').css('background-color','#CCC');
				$(this).siblings().css('color','#000').css('background-color','#FFF');
				type = 2;
				break;
			case '新增追溯档案数' :
				$(this).css('color','#FFF').css('background-color','#CCC');
				$(this).siblings().css('color','#000').css('background-color','#FFF');
				type = 3;
				break;
			case '新增防伪档案数' :
				$(this).css('color','#FFF').css('background-color','#CCC')
				$(this).siblings().css('color','#000').css('background-color','#FFF');
				type = 4;
				break;
		}
		$.ajax({
			url: visitCount,
			type: 'POST',
			dataType: 'json',
			data: {type: type, day: day, operatorid: 2},
			async: false,
			success: function (data){
				console.log(data);
				if (data.flag === 1) {
					myData = data.data;
				}
			},
			error: function (){
				console.log('no!');
			}
		})
		console.log(myData);
		/* 2. 绘图 */
		var labels = []; /* x轴数据 */
		var value = []; /* y轴value */
		var newLabels = [];
		/* 30天 */
		if (myData.length === 31) {
			console.log('30天');
			newLabels = [];
			var newKey = [];
			for (var i=0; i<myData.length; ++i) {
				if ( i % 3	 === 0) {
					newKey.push(myData[i].key);
				}
			}
			console.log('newKey:');
			console.log(newKey);
			for (var data of myData) {
				value.push(data.value);
				labels.push(data.key);
			}
			for (var data of newKey) {
				newLabels.push(data)
			}
		}
		/* 90天 */
		if (myData.length === 89) {
			console.log('90天');
			newLabels = [];
			var newKey = [];
			for (var i=0; i<myData.length; ++i) {
				if ( i % 11 === 0) {
					newKey.push(myData[i].key);
				}
			}
			console.log('newKey:');
			console.log(newKey);
			for (var data of myData) {
				value.push(data.value);
				labels.push(data.key);
			}
			for (var data of newKey) {
				newLabels.push(data)
			}
		}
		/* 7天 半年 */
		else if (myData.length === 7 || myData.length == 6) {
			newLabels = [];
			for (var data of myData) {
				labels.push(data.key);
				value.push(data.value);
				newLabels.push(data.key)
			}

		}

		var data = [
			{
				//value:[20,50,20,10,30,25,12],
				value: value,
				color:'#90b474',
				line_width:1
			}
		];
		var chart = new iChart.Area2D({
			render : 'canvasDiv',
			data: data,
			width : 800,
			height : 350,
			animation: true, //开启动画
			sub_option:{ //折线段配置
				//hollow_inside:false,//设置一个点的亮色在外环的效果
				smooth: true, //平滑曲线
				label:false, //不显示数据
				point_size:0
			},
			/* 十字线配置 */
			crosshair:{
				enable:true,
				line_color:'#90b474',
				line_width:1,
			},
			tip:{
				enable : true,
				listeners:{
					//tip:提示框对象、name:数据名称、value:数据值、text:当前文本、i:数据点的索引
					parseText:function(tip,name,value,text,i){
						return "浏览量:" + value + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
					}
				}
			},
			tipMocker:function(tips,i){
				return labels[i] + '<br/>' + tips;
			},
			labels:newLabels
		});
		chart.draw();

	});
	
	/* 选择日期插件初始化 */
	var dateStart = $('#date-start').datetimepicker({
		format: 'yyyy-mm-dd', //显示格式
		minView:'month', //
		language: 'zh-CN', //语言
		autoclose:true, //选择一个日期之后是否立即关闭该选择器
		weekStart: 1 //一周从哪天开始
	})
	dateStart.on('click', function () {
		$('#date-start').datetimepicker("setEndDate",$('#date-end').val())
	});
	var dateEnd = $('#date-end').datetimepicker({
		format: 'yyyy-mm-dd',
		minView:'month',
		language: 'zh-CN',
		autoclose:true,
		weekStart: 1
	})
	dateEnd.on('click', function () {
		$('#date-end').datetimepicker("setStartDate",$('#date-start').val())
	});

	/* 点击 '清除' */
	$('.clear-option').on('click', function () {
		console.log('清除!');
		$('#form-wrapper')[0].reset();
	});

	/* 点击 '导出' */
	$('.table-out').on('click', function () {
		console.log('导出!');
	});

	/* 点击 '查询' */
	$('.search').on('click',function () {
		getTableData();
	});

	/* 获取省份 */
	$.ajax({
		url: address,
		type: 'POST',
		dataType: 'json',
		data: {operatorid: 2},
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
			data: {parentcode: code, operatorid: 2},
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

	/* 获取数据 - 今天 */
	getNowData();

	/* 获取数据 - 昨天 */
	getYesterdayData();

	/* 获取产品类型列表 */
	getProductTypeList();

	/* 获取有无防伪码列表 */
	getFackCodeList();

	/* 获取排列方式列表 */
	getSortWayList();

	/* 获取表格数据 */
	getTableData();

});


/* 获取今天的数据 */
function getNowData () {
	$.ajax({
		url: staticTime,
		type: 'POST',
		dataType: 'json',
		data: {createdate: getNowDate(), operatorid: 2},
		success: function (data){
			console.log('获取今天的数据成功!');
			console.log(data);
			if (data.flag === 1) {
				$('.now').eq(0).text(data.data.archivesNum);
				$('.now').eq(1).text(data.data.enterpriseNum);
				$('.now').eq(2).text(data.data.fakearchivesNum);
				$('.now').eq(3).text(data.data.pageViewNum);

			}
		},
		error: function (){
			console.log('获取今天的数据失败!');
		}
	});
}

/* 获取昨天的数据 */
function getYesterdayData () {
	$.ajax({
		url: staticTime,
		type: 'POST',
		dataType: 'json',
		data: {createdate: getYesterday(), operatorid: 2},
		success: function (data){
			console.log('获取昨天的数据成功!');
			console.log(data);
			if (data.flag === 1) {
				$('.yesterday').eq(0).text(data.data.archivesNum);
				$('.yesterday').eq(1).text(data.data.enterpriseNum);
				$('.yesterday').eq(2).text(data.data.fakearchivesNum);
				$('.yesterday').eq(3).text(data.data.pageViewNum);
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
		data: {operatorid: 2},
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
		data: {operatorid: 2},
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
		data: {operatorid: 2},
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

/* 获取今天的日期 */
function getNowDate () {
	var myDate = new Date();
	var year = myDate.getFullYear();
	var month = (myDate.getMonth() + 1 ) < 9 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
	var date = (myDate.getDate() + 1 ) < 9 ? '0' + (myDate.getDate() + 1) : myDate.getDate() + 1;
	return '' + year + '-' + month + '-' + date;
}

/* 获取昨天的日期 */
function getYesterday () {
	var now = new Date();
	now = new Date(now.getTime() - 86400000);
	var year = now.getFullYear();
	var month = (now.getMonth() + 1 ) < 9 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
	var date = (now.getDate() + 1 ) < 9 ? '0' + (now.getDate() + 1) : now.getDate() + 1;
	return '' + year + '-' + month + '-' + date;
}

/* 获取表格数据 */
function getTableData(currentPage) {
	currentPage = currentPage || 1;
	var positionCode = $('.address-city').val() || $('.address-province').val() || '';  //地址
	var code = $('.product-type').val(); //类型
	var haveCreateFake = $('.security-code').val() //有无防伪码
	var createdatestart = $('#date-start').val(); //起止时间
	var createdateend = $('#date-end').val(); //截止时间
	var orderBy =  $('.sort-way').val();//排列方式
	var enterpriseNameOrProductionName = $('.company-name').val(); //企业名称
	console.log('地址:'+positionCode);
	console.log('类型:'+code);
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
			operatorid: 2,
			positionCode:positionCode,
			code: code,
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

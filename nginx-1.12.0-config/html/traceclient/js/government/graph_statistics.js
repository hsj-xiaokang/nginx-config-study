$(function () {

	firstInPage();

	/* 点击8个按钮 */
	var day = 7; //时间
	var type = 1; //类型
	$('.page-chart li,.chart-button span').click(function (){
		switch ($(this).text()) {
			case '最近7天' :
				$(this).css('color','#0daae4').css('border','1px solid #0daae4');
				$(this).siblings().css('color','#000').css('border','1px solid #FFF');
				day = 7;
				break;
			case '最近30天' :
				$(this).css('color','#0daae4').css('border','1px solid #0daae4');
				$(this).siblings().css('color','#000').css('border','1px solid #FFF');
				day = 31;
				break;
			case '最近90天' :
				$(this).css('color','#0daae4').css('border','1px solid #0daae4');
				$(this).siblings().css('color','#000').css('border','1px solid #FFF');
				day = 89;
				break;
			case '最近半年' :
				$(this).css('color','#0daae4').css('border','1px solid #0daae4');
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
			case '新增验证档案数' :
				$(this).css('color','#FFF').css('background-color','#CCC')
				$(this).siblings().css('color','#000').css('background-color','#FFF');
				type = 4;
				break;
		}
		getTableData(day, type);
	});
});

/* 获取图形报表数据 */
function getTableData (day, type) {
	var myData = [];
	$.ajax({
		url: visitCount,
		type: 'POST',
		dataType: 'json',
		data: {
			day: day,
			type: type,
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
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

	/* 设置刻度 */
	var maxArr = getMax(myData);

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
	if (myData.length === 7 || myData.length == 6) {
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
		labels:newLabels,
		/* 配置坐标系 */
		coordinate: {
			scale: [
					{
						position: 'left', //配置y轴
						start_scale:0,
						end_scale: maxArr[0],
						scale_space: maxArr[1]

					},
					{
						position: 'bottom',
						labels: newLabels
					}
			]
		}
	});
	chart.draw();
}

/* 首次进入页面获取数据 */
function firstInPage () {
	if (!getQueryString('type')) return;
	switch (getQueryString('type')) {
		case '1' :
			$('.chart-button span').eq(0).css('color','#FFF').css('background-color','#CCC');
			break;
		case '2' :
			$('.chart-button span').eq(1).css('color','#FFF').css('background-color','#CCC');
			break;
		case '3' :
			$('.chart-button span').eq(2).css('color','#FFF').css('background-color','#CCC');
			break;
		case '4' :
			$('.chart-button span').eq(3).css('color','#FFF').css('background-color','#CCC');
			break;
	}
	getTableData(7, getQueryString('type'));
}

/* 获取最大值 并设置 y轴刻度 */
function getMax (arr) {
	if (!arr) return;
	var max = arr[0].value;
	for (var i=0; i<arr.length; ++i) {
		if (arr[i].value > max) {
			max = arr[i].value;
		}
	}
	if (max <= 10) {
		return [10, 2];
	}
	if (max > 10 && max <= 50) {
		return [50, 10]
	}
	if (max > 50 && max <= 100) {
		return [100, 10];
	}
	if (max > 100) {
		var maxRemainder = max % 10;

		if (maxRemainder === 0) {
			return [max, max / 10];
		}
		else {
			return [max + (10-maxRemainder), (max + (10-maxRemainder)) / 10];
		}
	}
}

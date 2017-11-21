/* 基本信息 */
$(function () {

	/*******************************  地址四级联动 **************************************/
	/* 如果基本信息为空 */
	if (!sessionStorage.getItem('enterpriseid')) {
		$('.city-produce,.area-produce,.street-produce').hide();
		$('.city-legal,.area-legal,.street-legal').hide();

		/* 获取省份数据 */
		$.ajax({
			url: address,
			type: 'POST',
			dataType: 'json',
			data: {
				operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
				lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
			},
			success: function (data){
				console.log('查询地址成功!');
				console.log(data);
				if (data.flag === 1) {
					var html = '<option value="">--请选择--</option>';
					for (province of data.data) {
						html += '<option value="'+province.code+'">'+province.name+'</option>';
					}
					$('.province-produce').append(html);
					$('.province-legal').append(html);
				}
			},
			error: function (){
				console.log('查询地址失败!');
				$('.province-produce').append('<option>暂无数据</option>');
				$('.province-legal').append('<option>暂无数据</option>');
			}

		});
	}

	/* 省改变时 */
	$('.province-produce').change(function (){
		if ($(this).val() === '') return;
		var currentProvinceVal = '' //当前选择省的值
		currentProvinceVal = $(this).val();
		/* 市 */
		$.ajax({
			url: address,
			type: 'POST',
			dataType: 'json',
			data: {
				parentcode: currentProvinceVal,
				operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
				lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
			},
			success: function (data){
				if (data.data.length === 0) return;
				if (data.flag === 1) {
					var html = '<option value="">--请选择--</option>';
					for (city of data.data) {
						html += '<option value="'+city.code+'">'+city.name+'</option>'
					}
					$('.city-produce').html(html);
					$('.city-produce').show();
					$('.area-produce').hide();
					$('.street-produce').hide();
				}
			},
			error: function (){
				console.log('查询地址失败!');
				$('.city-produce').html('<option>暂无数据</option>');
			}
		});
	});
	$('.province-legal').change(function (){
		if ($(this).val() === '') return;

		var currentProvinceVal = '' //当前选择省的值
		currentProvinceVal = $(this).val();
		/* 选择市时的处理 */
		if (currentProvinceVal === '11') {  //北京
			currentProvinceVal = '110100000000';
		}
		if (currentProvinceVal === '12') { //天津
			currentProvinceVal = '120100000000';
		}
		/* 市 */
		$.ajax({
			url: address,
			type: 'POST',
			dataType: 'json',
			data: {
				parentcode: currentProvinceVal,
				operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
				lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
			},
			success: function (data){
				if (data.data.length === 0) return;
				if (data.flag === 1) {
					var html = '<option value="">--请选择--</option>';
					for (city of data.data) {
						html += '<option value="'+city.code+'">'+city.name+'</option>'
					}
					$('.city-legal').html(html);
					$('.city-legal').show();
					$('.area-legal').hide();
					$('.street-legal').hide();
				}
			},
			error: function (){
				console.log('查询地址失败!');
				$('.city-legal').html('<option>暂无数据</option>');
			}
		});
	});

	/* 市改变时 */
	$('.city-produce').change(function (){

		if ($(this).val() === '') return;
		$.ajax({
			url: address,
			type: 'POST',
			dataType: 'json',
			data: {
				parentcode: $('.city-produce').val(),
				operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
				lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
			},
			success: function (data){
				if (data.data.length === 0) return;
				if (data.flag === 1) {
					var html = '<option value="">--请选择--</option>';
					for (var area of data.data) {
						html += '<option value="'+area.code+'">'+area.name+'</option>'
					}
					$('.area-produce').html(html);
					$('.area-produce').show();
					$('.street-produce').hide();
				}
			},
			error: function (){
				console.log('查询地址失败!');
				$('.area-produce').html('<option>暂无数据</option>');
			}
		});
	});
	$('.city-legal').change(function (){

		if ($(this).val() === '') return;
		$.ajax({
			url: address,
			type: 'POST',
			dataType: 'json',
			data: {
				parentcode: $('.city-legal').val(),
				operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
				lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
			},
			success: function (data){
				if (data.data.length === 0) return;
				if (data.flag === 1) {
					var html = '<option value="">--请选择--</option>';
					for (var area of data.data) {
						html += '<option value="'+area.code+'">'+area.name+'</option>'
					}
					$('.area-legal').html(html);
					$('.area-legal').show();
					$('.street-legal').hide();
				}
			},
			error: function (){
				console.log('查询地址失败!');
				$('.area-legal').html('<option>暂无数据</option>');
			}
		});
	});

	/* 县改变时 */
	$('.area-produce').change(function (){

		if ($(this).val() === '') return;
		$.ajax({
			url: address,
			type: 'POST',
			dataType: 'json',
			data: {
				parentcode: $('.area-produce').val(),
				operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
				lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
			},
			success: function (data){
				if (data.data.length === 0) return;
				if (data.flag === 1) {
					var html = '<option value="">--请选择--</option>';
					for (var street of data.data) {
						html += '<option value="'+street.code+'">'+street.name+'</option>'
					}
					$('.street-produce').html(html);
					$('.street-produce').show();
					console.log('镇:');
					console.log(data);
				}
			},
			error: function (){
				console.log('查询地址失败!');
				$('.street-produce').html('<option>暂无数据</option>');
			}
		});
	});
	$('.area-legal').change(function (){

		if ($(this).val() === '') return;
		$.ajax({
			url: address,
			type: 'POST',
			dataType: 'json',
			data: {
				parentcode: $('.area-legal').val(),
				operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
				lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
			},
			success: function (data){
				if (data.data.length === 0) return;
				if (data.flag === 1) {
					var html = '<option value="">--请选择--</option>';
					for (var street of data.data) {
						html += '<option value="'+street.code+'">'+street.name+'</option>'
					}
					$('.street-legal').html(html);
					$('.street-legal').show();
				}
			},
			error: function (){
				console.log('查询地址失败!');
				$('.street-legal').html('<option>暂无数据</option>');
			}
		});
	});

	/***********************************************************************************************/



	/* 点击 'logo'、'营业执照'*/
	$('.logo,.businesslicense').on('click', function () {
		window.open('upload_image.html?selector=' + $(this).attr('id'))
	});

	/* 点击企业视频 */
	$('.upload-movie-wrapper').on('click', function () {
		$('#myModal-upload').modal('show');
	});

	/* 点击'保存'修改企业信息 */
	$('.form-save>div').on('click', function () {
		console.log('保存!');
		updateEnterpriseInfo();
	});

	/* 获取企业基本信息 */
	getEnterpriseInfo();


});



/* 获取企业基本信息 */
function getEnterpriseInfo () {
	console.log('获取企业基本信息');
	$.ajax({
		url: enterpriseInfo,
		type: 'POST',
		dataType: 'json',
		data: {
			enterpriseid: sessionStorage.getItem('enterpriseid'),
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
		success: function (data) {
			console.log('获取企业信息成功!');
			console.log('................................');
			console.log(data);
			if (data.flag === 1) {
				$('[name="enterprisename"]').val(data.data.enterprisename);
				$('.logo').css('background-image','url('+data.data.logoURL+')').css('background-size','cover').attr('data-src',data.data.logoURL);
				//生产地址 productionAddressPositionList
				showAddress(data.data.productionAddressPositionList, 'produce');
				$('[name="productionaddress"]').val(data.data.productionaddress);
				//法定地址
				showAddress(data.data.addressPositionList, 'legal');
				$('[name="address"]').val(data.data.address);
				$('.businesslicense').css('background-image','url('+data.data.businesslicenseURL+')').css('background-size','cover').	attr('data-src',data.data.businesslicenseURL);
				$('[name="enterprisephone"]').val(data.data.enterprisephone);
				$('[name="owner"]').val(data.data.owner);
				$('[name="enterpriseprofile"]').val(data.data.enterpriseprofile);
				$('[name="scope"]').val(data.data.scope);
				$('[name="serviceinformation"]').val(data.data.serviceinformation);
				//企业视频
				$('.upload-movie-wrapper video').attr('src',data.data.videopath);
			}
		},
		error: function () {
			 console.log('获取企业信息失败!');
		}
		
	});
}

/* 显示企业默认地址 */
function showAddress (arr, select) {
	console.log('显示企业默认地址');
	if (!arr) {
		$('.city-produce,.area-produce,.street-produce').hide();
		$('.city-legal,.area-legal,.street-legal').hide();

		/* 获取省份数据 */
		$.ajax({
			url: addressProvince,
			type: 'POST',
			dataType: 'json',
			data: {
				operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
				lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
			},
			success: function (data){
				console.log('查询地址成功!');
				console.log(data);
				if (data.flag === 1) {
					var html = '<option value="">--请选择--</option>';
					for (province of data.data) {
						html += '<option value="'+province.code+'">'+province.name+'</option>';
					}
					$('.province-produce').append(html);
					$('.province-legal').append(html);
				}
			},
			error: function (){
				console.log('查询地址失败!');
				$('.province-produce').append('<option>暂无数据</option>');
				$('.province-legal').append('<option>暂无数据</option>');
			}

		});
		return;
	}
	//console.log(arr[1].children);
	/* 省 */
	var province = '<option value="">--全部--</option>';
	if (arr[0]) {
		for (var address of arr[0].children) {
			province += '<option value="'+address.code+'">'+address.name+'</option>';
		}
		$('.province-' + select).html(province).val(arr[0].code);
	}
	if (arr[1]) {
		/* 市 */
		var city = '<option value="">--全部--</option>';
		for (var address of arr[1].children) {
			city += '<option value="'+address.code+'">'+address.name+'</option>';
		}
		$('.city-' + select).html(city).val(arr[1].code);
	}
	if (arr[2]) {
		/* 县 */
		var area = '<option value="">--全部--</option>';
		for (var address of arr[2].children) {
			area += '<option value="'+address.code+'">'+address.name+'</option>';
		}
		$('.area-' + select).html(area).val(arr[2].code);
	}
	if (arr[3]) {
		/* 镇 */
		var street = '<option value="">--全部--</option>';
		for (var address of arr[3].children) {
			street += '<option value="'+address.code+'">'+address.name+'</option>';
		}
		$('.street-' + select).html(street).val(arr[3].code);
	}
}

/* 点击'保存'修改企业信息 */
function updateEnterpriseInfo () {
	console.log('修改企业信息!');
	console.log();
	/* 获取表单value */
	var enterprisename = $('[name="enterprisename"]').val(); //名称
	var logoURL = $('.logo').attr('data-src'); //logo
	var productionaddressid = $('.street-produce').val() || $('.area-produce').val() || $('.city-produce').val() || $('.province-produce').val(); //生产地址
	var productionaddress = $('[name="productionaddress"]').val(); //生产地址详细地址
	var addressid = $('.street-legal').val() || $('.area-legal').val() || $('.city-legal').val() || $('.province-legal').val();; //法定地址
	var address = $('[name="address"]').val(); //法定地址详细地址
	var businesslicenseURL = $('.businesslicense').attr('data-src'); //营业执照
	var enterprisephone = $('[name="enterprisephone"]').val(); //联系方式
	var owner = $('[name="owner"]').val(); //负责人
	var enterpriseprofile = $('[name="enterpriseprofile"]').val(); //企业简介
	var scope = $('[name="scope"]').val(); //业务范围
	var serviceinformation = $('[name="serviceinformation"]').val(); //服务信息
	var videoURL = $('.upload-movie-wrapper>video').attr('src'); //企业视频

	/*console.log(enterprisename);
	console.log(productionaddressid);
	console.log(productionaddress);
	console.log(addressid);
	console.log(address);
	console.log(enterprisephone);
	console.log(owner);
	console.log(enterpriseprofile);
	console.log(scope);
	console.log(serviceinformation);
	console.log('logo = '+ logoURL);
	console.log('businesslicense = ' + businesslicenseURL);
	console.log('video = ' + videoURL);*/
	
	/* 数据验证 */
	if (!enterprisename) {
		commonAlert('请填写企业名称');
		return;
	}
	if (!logoURL) {
		commonAlert('请上传企业logo');
		return;
	}
	if (!productionaddressid) {
		commonAlert('请选择生产地址');
		return;
	}
	if (productionaddressid) {
		$.ajax({
			url: addressProvince,
			type: 'POST',
			dataType: 'json',
			data: {
				parentcode: productionaddressid,
				operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
				lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
			},
			success: function (data){
				console.log('检测地址成功!');
				console.log(data);
				if (data.data.length >= 1) {
					console.log('请完善地址');
					commonAlert('请完善生产地址');
					return;
				}
				if (data.flag === 1 && data.data.length < 1) {
					console.log('没有地址了!');
				}
			},
			error: function (){
				console.log('检测地址失败!');
				return;
			}
		});
	}
	if (!productionaddress) {
		commonAlert('请补充生产地址');
		return;
	}
	if (!addressid) {
		commonAlert('请选择法定地址');
		return;
	}
	if (addressid) {
		$.ajax({
			url: addressProvince,
			type: 'POST',
			dataType: 'json',
			data: {
				parentcode: addressid,
				operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
				lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
			},
			success: function (data){
				console.log('检测地址成功!');
				if (data.data.length >= 1) {
					console.log('请完善地址');
					commonAlert('请完善法定地址');
					return;
				}
				if (data.flag === 1 && data.data.length < 1) {
					console.log('没有地址了!');
				}
			},
			error: function (){
				console.log('检测地址失败!');
				return;
			}
		});
	}
	if (!address) {
		commonAlert('请补充法定地址');
		return;
	}
	$.ajax({
		url: sessionStorage.getItem('enterpriseid') ? updateEnterprise : addEnterprise,
		type: 'POST',
		dataType: 'json',
		data: {
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			enterpriseid: sessionStorage.getItem('enterpriseid'), //企业信息编号
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode,
			userid: JSON.parse(sessionStorage.getItem('loginInfo')).uid, //账号信息
			logoURL: logoURL,
			videoURL: videoURL,
			businesslicenseURL: businesslicenseURL, //营业执照
			enterprisename: enterprisename,
			enterprisephone: enterprisephone,
			owner: owner,
			addressid: addressid,
			address: address,
			productionaddressid: productionaddressid,
			productionaddress: productionaddress,
			scope: scope,
			serviceinformation: serviceinformation,
			enterpriseprofile: enterpriseprofile
		},
		success: function (data) {
			console.log('修改企业信息成功!');
			console.log(data);
			if (data.flag === 1) {
				/* 根据uid 获取 enterpriseid */
				$.ajax({
					url: enterpriseByUserId,
					type: 'POST',
					dataType: 'json',
					data: {
						operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
						userid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
						lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
					},
					success: function (data) {
						console.log('获取enterpriseid成功!');
						console.log(data);
						if (data.flag === 1 && data.data && data.data.enterpriseid) {
							sessionStorage.setItem('enterpriseid' ,data.data.enterpriseid);
							console.log('获取的enterpriseid = ' + sessionStorage.getItem('enterpriseid'));
							window.location.href = 'member_home.html';
						}
						else {
							console.log('获取enterpriseid失败!');
						}
					},
					error: function () {
						console.log('获取enterpriseid失败!');
					}
				});
			}
			else {
				commonAlert(data.message);
			}
		},
		error: function () {
			console.log('修改企业信息失败!');
		}
	});
}




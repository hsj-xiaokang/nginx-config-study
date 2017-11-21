$(function () {
	//限制键盘只能按数字键、小键盘数字键、退格键
	$('[name="productionbatchnumber"]').keydown(function (e) {
		var code = parseInt(e.keyCode);
		if (code >= 96 && code <= 105 || code >= 48 && code <= 57 || code == 8) {
			return true;
		}
		else {
			return false;
		}
	});

	/* 选择日期插件初始化 */
	$('[name="workeddate"]').datetimepicker({
		format: 'yyyy-mm-dd', //显示格式
		minView:'month', //
		language: 'zh-CN', //语言
		autoclose:true, //选择一个日期之后是否立即关闭该选择器
		weekStart: 1 //一周从哪天开始
	});

	/* 点击 '图片 - 产销过程' */
	$('#process-main>div>div').on('click', function () {
		//$('#uploadForm')[0].reset(); //初始化表单
		//$('.imageBox').attr('style', ''); // 清空图片

		/* 设置默认步骤 */
		//$('.upload-file-input').val($.trim($(this).text()));
		//$('#uploadForm .form-group').eq(0).show();
		//$('#myModal-upload').attr('data-process-id', $(this).parent().attr('data-process-id'));
		//$('#myModal-upload').attr('data-attestation-id', '');
		//$('#myModal-upload').modal('show');
		//$('.imageBox').show();
		//$('.cropped').hide();
		window.open('upload_image.html?selector=' + $(this).attr('id'));
	});

	/* 点击完成 */
	$('.product-submit').on('click', function () {
		console.log('完成');
		/* 设置 产品认证和产销过程数据 */
		setAttestationAndProcess();

		var productionbatchno = $('[name="productionbatchno"]').val();
		var productionbatchnumber = $('[name="productionbatchnumber"]').val();
		/* 检验数据合法性 */
		if (productionbatchno.length === 0) {
			commonAlert('请填写产品批次号');
			return;
		}
		else if (productionbatchnumber.length === 0) {
			commonAlert('请填写产品数量');
			return;
		}
		else if (attestationImageArr.length === 0) {
			commonAlert('请上传产品认证图片');
			return;
		}
		else if (processImageArr.length === 0) {
			commonAlert('请设置产销过程步骤');
			return;
		}
		/* 获取传递过来的参数 */
		var productInfo = getParam();
		productInfo.enterpriseid = sessionStorage.getItem('enterpriseid');
		productInfo.operatorid = JSON.parse(sessionStorage.getItem('loginInfo')).uid;
		productInfo.lastlogincode = JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode;
		productInfo.productionbatchno = productionbatchno; // 批次号
		productInfo.productionbatchnumber = productionbatchno; //数量
		productInfo.productionAuthenticationResourceList =  JSON.stringify(attestationImageArr);  //产品认证
		productInfo.marketingProcessList = JSON.stringify(processImageArr); //产销过程
		$.ajax({
			url: addProduction,
			type: 'POST',
			dataType: 'json',
			data: productInfo,
			success: function (data) {
				console.log(data);
				if (data.flag === 1) {
					/* 显示成功页面 */
					console.log('产品档案添加成功!');
					$('.success-wrapper').show();
					$('#basic-info-body').hide();
					$('#basic-info-caption02').hide();
					/* 清空新建档案时产生的session */
					clearSessionToNewProduct();
					/* 倒计时 */
					var number = 5;
					var clear = setInterval(function (){
						$('.success-number').text(--number);
						if (number === 0) {
							clearInterval(clear);
							window.location.href = 'member_home.html';
						}
					},1000);
				}
				else if (data.flag === 0) {
					commonAlert('添加档案失败');
					return;
				}
			},
			error: function () {
				console.log('表单提交失败!');
			},
			beforeSend: function () {
				/* ajax发送之前 product-submit*/
				$('.product-submit').addClass('ban-button');
			},
			complete: function () {
				/* ajax完成时需处理的事情 */
				$('.product-submit').removeClass('ban-button');
			}
		});
	});

	/* 返回上一步 */
	$('.product-back').on('click', function () {
		console.log('返回上一步');
		setAttestationAndProcess(); //获取产品认证 产销过程 图片数组
		/* 当前数据存入session */
		var newProductInfo2 = {
			productionbatchno: $('[name="productionbatchno"]').val(),
			productionbatchnumber: $('[name="productionbatchnumber"]').val(),
			processImageArr: processImageArr,
			attestationImageArr: attestationImageArr
		};
		sessionStorage.setItem('newProductInfo2', JSON.stringify(newProductInfo2));

		/* 返回上一步 */
		history.back(-1);
	});

	/* 查询出列表显示用的产品证书信息 */
	getAllProductionAuthentication();

	isAgainLoad();

	/* 点击 产销过程的完成 */
	var stepNoCount = -1; //作业步骤计数
	$('.process-ad-submit').on('click', function () {

		/* 隐藏错误信息提示 */
		$('.stepname-error,.workeddate-error,.process-image-error,.workedcontent-error').hide();

		/* 获取数据 */
		var maxStep = 9; //最多添加9步
		var stepname = $('[name="stepname"]').val().trim(); //作业名称
		var workeddate = $('[name="workeddate"]').val().trim(); //作业时间
		var processImageFirst = $('#process-image-1').attr('data-src'); //作业图片第1张
		var processImageAll = []; //所有作业图片
		var workedcontent = $('[name="workedcontent"]').val().trim(); //作业记录

		var isEdit = $('[name="hidden"]').val() !== ''; //是否是编辑
		var id = $('[name="hidden"]').val() !== '' ? parseInt($('[name="hidden"]').val()) : ++stepNoCount; //id

		/* 获取所有图片地址 */
		if ($('.process-image>div').length > 1) {
			for (var i=0; i<$('.process-image>div').length; ++i) {
				if (i === 0) continue;
				var currentImagePath = $('.process-image>div>div').eq(i).attr('data-src'); //当前图片地址
				if (!currentImagePath) continue;

				processImageAll.push({'resourcepath': currentImagePath});
			}
		}
		/* 验证数据 */
		if (stepname.length === 0) { //名称
			$('.stepname-error').text('请填写作业名称').show();
			console.log('..................');
			console.log(stepname.length);
			return;
		}
		if (workeddate.length === 0) { //时间
			$('.workeddate-error').text('请选择作业时间').show();
			return;
		}
		if (processImageAll.length === 0) { //作业图片
			$('.resourceList-error').text('请上传作业图片').show();
			return;
		}
		if (workedcontent.length === 0) {
			$('.workedcontent-error').text('请填写作业记录').show();
			return;
		}

		/* 保存当前数据 */
		if (isEdit) {
			processImageArr[id] = {
				id : id,
				resourceList: processImageAll, //作业图片
				stepNo: id, //作业步骤
				stepName: stepname, //作业名称
				workeddate: workeddate, //作业时间
				workedcontent: workedcontent //作业记录
			};
		}
		else {
			processImageArr.push({
				id : id,
				resourceList: processImageAll, //作业图片
				stepNo: id, //作业步骤
				stepName: stepname, //作业名称
				workeddate: workeddate, //作业时间
				workedcontent: workedcontent //作业记录
			});
		}

		
		console.log('processImageArr');
		console.log(processImageArr);
		var template =  '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-id="'+id+'">'+
						'	<span class="col-lg-12 col-md-12 col-sm-12 col-xs-12 process-preview-caption">' +
						'		<span>'+stepname+'</span>' +
						'		<span class="process-date">'+workeddate+'</span>' +
						'		<span class="process-edit" onclick="editProcess('+id+')">编辑</span>' +
						'	</span>'+
						'	<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 process-preview-image">'+
						'		<div class="image-number"><span>'+processImageAll.length+'</span>&nbsp;张</div>'+
						'		<img src="'+processImageFirst+'"/>'+
						'	</div>'+
						'	<div class="col-lg-9 col-md-9 col-sm-12 col-xs-12 process-preview-text">'+workedcontent+'</div>'+
						'</div>';


		if (isEdit) {
			$('.process-preview-wrapper>div').eq(id).html(template);
		}
		else {
			$('.process-preview-wrapper').append(template);
		}


		$('.process-add-main').hide(); //添加区域隐藏
		$('.process-preview-wrapper').show(); //图片文字预览区域显示
		$('.process-preview-add').show(); //添加按钮

		var length = $('.process-preview-wrapper>div').length;
		console.log('length = ' + length);

		/* 添加9步后不能再添加	*/
		if (length === maxStep) {
			$('.process-preview-add').hide(); //添加按钮
		}
	});

	/* 点击 产销过程的 添加 */
	$('.process-preview-add').on('click', function () {
		var length = $('.process-preview-wrapper>div').length;
		console.log('length = ' + length);
		console.log('-------------------------------------');
		/* 初始化表单 */
		console.log('初始化表单!');
		$('#processForm')[0].reset();
		$('[name="hidden"]').val(''); //清空隐藏域
		$('.process-image>div:not(:first-child)').remove();
		$('.process-preview-add').hide(); //添加按钮
		$('.process-add-main').show(); //添加区域隐藏
	});

	/* 点击产销过程的图片 */
	$('.add-image').on('click', function () {
		/* 获取图片张数 */
		var maxImageNum = 9; //最多几张图片
		var imageLength = $('.process-image>div').length;

		if (imageLength > maxImageNum) {
			commonAlert('最多上传9张图片');
			return;
		}

		/*var template = 	'<div class="col-lg-3 col-md-3 col-sm-4 col-xs-4">'+
						'	<div id="process-image-'+imageLength+'">'+
						'		<div onclick="closeImage('+imageLength+')" class="process-image-close">'+
						'			<img src="../img/common/close.png" style="width: 24px;height:24px;">' +
						'		</div>' +
						'	</div>'+
						'</div>';

		$('.process-image').append(template);*/
		/* 跳转图片裁剪页面 */
		window.open('upload_image.html?selector=process-image-' + imageLength);
	});

});

/* 点击产销过程的编辑 */
function editProcess(id) {
	console.log('编辑产销过程');
	console.log(processImageArr[id]);
	var currentProcess = processImageArr[id]; //当前产销过程
	$('[name="stepname"]').val(currentProcess.stepName); //作业名称
	$('[name="workeddate"]').val(currentProcess.workeddate); //作业时间
	$('[name="workedcontent"]').val(currentProcess.workedcontent); //作业记录
	$('[name="hidden"]').val(currentProcess.id); //id

	/* 显示出产销图片 */
	var template = '';
	for (var i=0; i<currentProcess.length; ++i) {
		var imageLength = i + 1;
		template+= '<div class="col-lg-3 col-md-3 col-sm-4 col-xs-4">'+
				   '	<div id="process-image-'+imageLength+'" class="add-image" style="background-image:url('+currentProcess[i].resourcepath+')" data-src="'+currentProcess[i].resourcepath+'">'+
				   '		<div onclick="closeImage('+imageLength+')" class="process-image-close">'+
				   '			<img src="../img/common/close.png" style="width: 24px;height:24px;">' +
				   '		</div>' +
				   '	</div>'+
				   '</div>';
	}


	$('.process-image').append(template);
	$('.process-preview-add').hide(); //隐藏添加按钮
	//css('background-image','url('+path+')').css('background-size','cover').attr('data-src',path);

	$('.process-add-main').show(); //添加区域显示
}

/* 查询出列表显示用的产品证书信息 */
var authenticationArr = [];
function getAllProductionAuthentication() {
	$.ajax({
		url: queryAllProductionAuthentication,
		type: 'POST',
		dataType: 'json',
		data: {
			status: 0,
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
		success: function (data) {
			console.log('yes');
			console.log(data);
			if (data.flag === 1) {
				var template = '';
				for (var i=0; i<data.data.length; ++i) {
					template += '<div class="col-lg-3 col-md-3 col-sm-4 col-xs-6">' +
								'	<div data-attestation-id="'+i+'" id="data-attestation-'+i+'" onclick="clickAuthenticationImage('+i+')" style="background-image: url('+data.data[i].imageURL+')">' +
								'		<div class="authentication-name-wrapper">'+data.data[i].authenticationname+'</div>' +
								'	</div>' +
								'</div>';
				}
				$('.authentication-main').html(template);
				authenticationArr = data.data;
				/* 如果有sessoin中的数据 则设置session中的数据 */
				if (sessionStorage.getItem('newProductInfo2')) {
					setSessionData();
				}
			}
		},
		error: function () {
			console.log('error!');
		}
	})
}

/* 获取传递过来的参数 */
function getParam () {
	var productInfo = JSON.parse(sessionStorage.getItem('productInfo'));
	return productInfo;
}

/* 点击产品认证的图片 */
function clickAuthenticationImage (num) {
	//$('#uploadForm')[0].reset(); //初始化表单
	//$('.imageBox').attr('style', ''); // 清空图片
	//$('#uploadForm .form-group').eq(0).hide();
	//$('#myModal-upload').attr('data-attestation-id', num + 1);
	//$('#myModal-upload').attr('data-process-id', '');
	//$('#myModal-upload').modal('show');
	//$('.imageBox').show();
	//$('.cropped').hide();
	//console.log('dayin');
	console.log('data-attestation-' + num);
	window.open('upload_image.html?selector=data-attestation-' + num)
}

/* 设置 产品认证 产销过程数据 */
var attestationImageArr = []; //产品认证
var processImageArr = []; //产销过程
function setAttestationAndProcess () {
	/* 产品认证 */
	var attestationLength = $('#authentication-main>div>div').length;
	for (var i=0; i<attestationLength; ++i) {
		var currentPath = $('#authentication-main>div>div').eq(i).attr('data-src');

		if (!currentPath) continue;
		attestationImageArr.push({
			id: i,
			resourcepath: currentPath,
			releatedid: authenticationArr[i].paid,  //产品认证编号
			resourcename: authenticationArr[i].authenticationname //产品证书名称
		});
	}

	/* 产销过程 */
	/*for (var i=0; i<$('#process-main>div>div').length; ++i) {

		var currentPath = $('#process-main>div>div').eq(i).attr('data-src');
		var currentStep = $('#process-main>div>div').eq(i).find('.process-name-wrapper').text();

		if (!currentPath) continue;

		processImageArr.push({
			id: i,
			resourcepath: currentPath,
			stepNo: i+1,
			stepname: currentStep
		});
	}*/
}

/* 设置 session中的数据 */
function setSessionData ( ) {
	/* 如有数据 设置session数据 */
	console.log('newProduct2-session:-----------------------');
	console.log(JSON.parse(sessionStorage.getItem('newProductInfo2')));

	var productInfo = JSON.parse(sessionStorage.getItem('newProductInfo2'));
	$('[name="productionbatchno"]').val(productInfo.productionbatchno); //批次号
	$('[name="productionbatchnumber"]').val(productInfo.productionbatchnumber); //数量

	/* 产品认证 */
	if (productInfo.attestationImageArr.length > 0) {
		for (var attestationImage of productInfo.attestationImageArr) {
			$('#authentication-main>div>div').eq(attestationImage.id).css('background-image','url('+attestationImage.resourcepath+')').css('background-size','cover').attr('data-src',attestationImage.resourcepath);
		}
	}
	/* 产销过程 */
	/*if (productInfo.processImageArr.length > 0) {
		for (var processImage of productInfo.processImageArr) {
			$('#process-main>div>div').eq(processImage.id).css('background-image','url('+processImage.resourcepath+')').css('background-size','cover').attr('data-src',processImage.resourcepath);
			$('.process-name-wrapper').eq(processImage.id).text(processImage.stepname);
		}
	}*/
}

/* 清空新建档案时产生的session */
function clearSessionToNewProduct () {

	if (sessionStorage.getItem('productInfo')) sessionStorage.removeItem('productInfo');

	if (sessionStorage.getItem('sessionAddress')) sessionStorage.removeItem('sessionAddress');

	if (sessionStorage.getItem('sessionPictureAndVideo')) sessionStorage.removeItem('sessionPictureAndVideo');

	if (sessionStorage.getItem('sessionDescription')) sessionStorage.removeItem('sessionDescription');

	if (sessionStorage.getItem('sessionShopStructure')) sessionStorage.removeItem('sessionShopStructure');

	if (sessionStorage.getItem('sessionShopData')) sessionStorage.removeItem('sessionShopData');

	if (sessionStorage.getItem('newProductInfo2')) sessionStorage.removeItem('newProductInfo2');
}

/*
*  当页面再次刷新时清空当前页面的session
*  window.name 由 new_product1.html页面初始化
* */
function isAgainLoad() {
	++window.name;
	if (window.name > 1) {
		if (sessionStorage.getItem('newProductInfo2')) sessionStorage.removeItem('newProductInfo2');
	}
}

/* 点击产销过程的图片的叉叉 */
var deleteImage  = {};
function closeImage(imageLength) {
	var deleteImage = $('#process-image-' + imageLength).parent().remove();
}



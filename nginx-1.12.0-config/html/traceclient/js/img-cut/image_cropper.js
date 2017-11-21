
/* 图片裁剪 */

$(function () {

	/* 如若是产销过程 设置默认步骤 */
	setImageName();

	/* 配置项 */
	var $image = $('.show-image'),
		$dataX = $('#dataX'),
		$dataY = $('#dataY'),
		$dataHeight = $('#dataHeight'),
		$dataWidth = $('#dataWidth'),
		$dataRotate = $('#dataRotate'),
		options = {
			// strict: false,
			// responsive: false,
			// checkImageOrigin: false

			// modal: false,
			// guides: false,
			// highlight: false,
			// background: false,

			// autoCrop: false,
			// autoCropArea: 0.5,
			// dragCrop: false,
			// movable: false,
			// resizable: false,
			// rotatable: false,
			// zoomable: false,
			// touchDragZoom: false,
			// mouseWheelZoom: false,

			// minCanvasWidth: 320,
			// minCanvasHeight: 180,
			// minCropBoxWidth: 160,
			// minCropBoxHeight: 90,
			// minContainerWidth: 320,
			// minContainerHeight: 180,

			// build: null,
			// built: null,
			// dragstart: null,
			// dragmove: null,
			// dragend: null,
			// zoomin: null,
			// zoomout: null,

			/*aspectRatio: 1 / 2,*/
			//preview: '.img-preview', //添加额外的元素（容器）的预览
			crop: function (data) {
				$dataX.val(Math.round(data.x));
				$dataY.val(Math.round(data.y));
				$dataHeight.val(Math.round(data.height));
				$dataWidth.val(Math.round(data.width));
				$dataRotate.val(Math.round(data.rotate));
			}
		};

	/* 初始化 */
	$image.on({
		'build.cropper': function (e) {
			//console.log(e.type);
		},
		'built.cropper': function (e) {
			//console.log(e.type);
		},
		'dragstart.cropper': function (e) {
			//console.log(e.type, e.dragType);
		},
		'dragmove.cropper': function (e) {
			//console.log(e.type, e.dragType);
		},
		'dragend.cropper': function (e) {
			//console.log(e.type, e.dragType);
		},
		'zoomin.cropper': function (e) {
			//console.log(e.type);
		},
		'zoomout.cropper': function (e) {
			//console.log(e.type);
		}
	}).cropper(options);

	/* 选择图片 */
	var $inputImage = $('#file'),
		URL = window.URL || window.webkitURL,
		blobURL;

	if (URL) {
		$inputImage.change(function () {

			$('.upload-error').text('').hide(); //隐藏错误提示
			$('.imageBox').show(); //显示出裁剪区域
			$('#btnCrop').removeClass('stop-btnCrop'); //移除 '裁剪'按钮禁用状态

			var files = this.files,
				file;
			
			if (files && files.length) {
				file = files[0];
				

				/* 限制大小 */
				var maxSize = 1 * 1024 * 1024 * 2; //2M
				if (file.size > maxSize) {
					$('.upload-error').text('请上传2M以内的图片').show();
					$('.imageBox').hide();
					$('#btnCrop').addClass('stop-btnCrop');
					return;
				}

				/* 限制格式 */
				var ext = file.name.substring(file.name.lastIndexOf('.'), file.name.length).toUpperCase(); //后缀
				if (ext !== '.JPG' && ext !== '.JPEG' && ext !== '.BMP' && ext !== '.PNG') {
					console.log('请上传图片文件');
					$('.upload-error').text('请上传图片文件').show();
					$('.imageBox').hide();
					return;
				}

				
				if (/^image\/\w+$/.test(file.type)) {
					blobURL = URL.createObjectURL(file);
					$image.one('built.cropper', function () {
						URL.revokeObjectURL(blobURL); // Revoke when load complete
					}).cropper('reset', true).cropper('replace', blobURL);
					/*$inputImage.val('');*/
				}
				else {
					showMessage('Please choose an image file.');
				}
			}
		});
	}
	else {
		$inputImage.parent().remove();
	}

	/* 点击裁剪 */
	var imgUrl = '';  //裁剪后图片的base64字符串
	$("#btnCrop").click(function() {

		/* 未选择图片 */
		if (!blobURL) {
			$('.upload-error').text('请选择图片').show();
			$('.imageBox').hide();
			return;
		}


		var dataURL = $image.cropper('getCroppedCanvas');
		console.log(dataURL);
		imgUrl = dataURL.toDataURL("image/jpeg", 0.8);
		$('.cropped').html('<img src="'+imgUrl+'"/>');
		$('.upload-image-submit').addClass('is-ok');
	});

	/* 点击确定 */
	$('.upload-image-submit').on('click', function () {
		console.log('确定');
		if (!imgUrl) return;

		/* 上传图片 */
		$.ajax({
			url: uploadImageByBase64 + '?operatorid=' + JSON.parse(sessionStorage.getItem('loginInfo')).uid + '&lastlogincode=' + JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode,
			type: 'POST',
			data: {
				base64Data: imgUrl
			},
			timeout: 10000,
			dataType: 'JSON',
			success: function (data) {
				console.log('success!');
				console.log(data);
				if (data.flag === 1) {

					/* 企业资质 */
					if (getQueryString('enterpriseid') && getQueryString('enterpriseQualificationsId')) uploadFileFunToEnterpriseNatural(getQueryString('enterpriseid'), getQueryString('enterpriseQualificationsId'), data.data[0].resouceURL);

					/* 店铺 */
					else if (getQueryString('selector').indexOf('shop-icon') > -1) setShopIcon(getQueryString('selector'), data.data[0].resouceURL);

					/* 产销过程 */
					else if (getQueryString('selector').indexOf('process-image-') > -1) setProcessImage(getQueryString('selector'), data.data[0].resouceURL);

					/* 其他 */
					else operateParentWindow(getQueryString('selector'), data.data[0].resouceURL);

				}
			},
			error: function (error) {
				$('.upload-error').text('图片上传失败,请重试').show();
				//$('.imageBox').hide();
			},
			complete: function (result) {
				$('.upload-image-submit').removeClass('upload-process');
				/* 上传超时设置 */
				if(result.statusText === 'timeout') {
					console.log('超时了!!!');
				}
				else {
					$('.upload-image-submit').css('background-color','#b3b3b3');
				}
			},
			beforeSend: function () {
				$('.upload-image-submit').addClass('upload-process');
			}
		});
	});

	/* 点击取消 */
	$('.upload-image-cancel').on('click', function () {
		closeWindow();
	});

});

/* 关闭当前窗口 */
var closeWindow = navigator.userAgent.indexOf('Firefox') > -1 ?
	function(){location.href = "about:blank";}
	:
	function(){
		window.opener = null;
		window.open("", "_self", "");
		window.close();
	};

/*
	作用: 操作父窗口
	参数: selector: 选择器 path: 图片/视频路径
*/
function operateParentWindow (selector, path) {

	var isNewProduct = getQueryString('selector').indexOf('picture') > -1; // 从新建档案1传过来的
	var isBaseInfo = getQueryString('selector').indexOf('logo') > -1 || getQueryString('selector').indexOf('businesslicense') > -1; // 基本信息传过来的
	var isNewProduct2 = getQueryString('selector').indexOf('data-attestation') > -1; // 产品认证

	/* 新建追溯档案1 或者 基本信息 的图片都显示为  130 * 136 大小 */
	if (isNewProduct || isBaseInfo) {
		$('#' + selector, window.opener.document).css('background-image','url('+path+')').css('background-size','130px 136px').attr('data-src',path);
	}
	/* 新建追溯档案2的产品认证 图片 100% * 100% */
	else if (isNewProduct2) {
		$('#' + selector, window.opener.document).css('background-image','url('+path+')').css('background-size','100% 100%').attr('data-src',path);
	}
	else {
		$('#' + selector, window.opener.document).css('background-image','url('+path+')').css('background-size','cover').attr('data-src',path);
	}
	closeWindow();
}

/* 产销过程设置默认步骤 */
function setImageName () {

	var step = getQueryString('selector');
	if (!step || step.indexOf('data-process') === -1) return;

	var stepInt = parseInt(step.substring(13, step.length)) + 1;
	$('.upload-file-input').val('第' + stepInt + '步');
}

/* 上传企资质图片 */
function uploadFileFunToEnterpriseNatural(enterpriseid, enterpriseQualificationsId, path) {
	console.log('企业资质');
	$.ajax({
		url: addNatural,
		dataType: "json",
		type: 'POST',
		data: {
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode,
			enterpriseid: enterpriseid,
			enterpriseQualificationsId: enterpriseQualificationsId,
			currentEnterpriseQualificationsURL: path
		},
		success: function (data) {
			console.log(data);
			if (data.flag === 1){
				console.log('更新企业资质成功!');
				/* 刷新父窗口 */
				//self.opener.location.reload();
				//window.opener.location.href = window.opener.location.href;
				/* 调用父窗口方法刷新页面 */
				window.opener.getNaturalList();
				closeWindow();
			}
		},
		error: function () {
			$('.upload-error').text('图片上传失败,请重试').show();
			$('.imageBox').hide();
		}
	});

}

/* 设置店铺图标 */
function setShopIcon (selector, path) {
	$('#' + selector, window.opener.document).css('background-image','url('+path+')').attr('data-src',path);
	closeWindow();
}

/* 产销过程 */
function setProcessImage (selector, path) {
	var imageLength = selector.replace('process-image-', '');
	console.log('imageLength = ' + imageLength);
	var template = 	'<div class="col-lg-3 col-md-3 col-sm-4 col-xs-4">'+
					'	<div id="process-image-'+imageLength+'" class="add-image">'+
					'		<div onclick="closeImage('+imageLength+')" class="process-image-close">'+
					'			<img src="../img/common/close.png" style="width: 24px;height:24px;">' +
					'		</div>' +
					'	</div>'+
					'</div>';
	$('.process-image', window.opener.document).append(template);
	$('#' + selector, window.opener.document).css('background-image','url('+path+')').css('background-size','100% 100%').attr('data-src',path);
	closeWindow();
}


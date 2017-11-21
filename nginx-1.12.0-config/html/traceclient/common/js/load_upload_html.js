/* 加载上传文件页面 */
(function loadUploadFile () {
	var uploadFile = $('.upload-file');
	if (uploadFile.length === 0 || !uploadFile) $('body').append('<div class="upload-file"></div>');

	$('.upload-file').load('../common/html/upload_file.html', function () {
		uploadMOvie();
	});
})();

/* 上传文件的方法 - 基本信息 */
function uploadMOvie () {

	/* 点击 '取消' */
	$('.upload-image-cancel').on('click', function () {
		$('#myModal-upload').modal('hide');
		$('.upload-error').hide();
		$('#btnCrop').removeClass('stop-btnCrop'); //移除 '裁剪'按钮禁用状态
	});


	/* 当选择的文件改变时 */
	$('#file').on('change', function(){

		$('.upload-error').text('').hide(); //隐藏错误提示
		$('#btnCrop').removeClass('stop-btnCrop'); //移除 '裁剪'按钮禁用状态
		/* 文件大小格式限制 */
		var files = $('#file').prop('files'); //文件对象
		console.log(files);
		var filesPath = $('#file').val(); //文件路径包括后缀
		var extStart = filesPath.lastIndexOf(".");
		var ext = filesPath.substring(extStart, filesPath.length).toUpperCase();

		var maxSize = 1 * 1024 * 1024 * 20; //2M
		/* 限制格式 */
		if (ext !== '.MP4' && ext !== '.AVI') {
			console.log('请上传视频文件');
			$('.upload-error').text('请上传视频文件').show();
			$('.imageBox').hide();
			return;
		}
		/* 限制大小 */
		if (files[0].size >maxSize) {
			console.log('视频太大!');
			$('.upload-error').text('请上传20M以内的视频').show();
			$('.imageBox').hide();
			return;
		}
	});

	/* 开始上传 */
	$('.upload-image-submit').on('click', function () {
		/* 视频上传 */
		$('.upload-image-submit').addClass('upload-process');

		var files = $('#file').prop('files');



		var formData = new FormData();
		formData.append('uploadfile', files[0]);
		$.ajax({
			url: uploadImage + '?operatorid=' + JSON.parse(sessionStorage.getItem('loginInfo')).uid + '&lastlogincode=' + JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode,
			type: 'POST',
			data: formData,
			processData : false,
			contentType : false,
			timeout: 10000,
			success: function (data) {
				console.log('视频上传成功!');
				console.log(data);
				if (data.flag === 1) {
					$('.upload-movie-wrapper video').attr('src',data.data[0]);
					$('#myModal-upload').modal('hide');
				}
			},
			error: function () {
				console.log('error!');
			},
			beforeSend: function () {
				console.log('上传中');
				$('.upload-image-submit').addClass('upload-process');
			},
			complete: function (result){
				console.log('视频上传完成');
				$('.upload-image-submit').removeClass('upload-process')
			}
		})


	});
}


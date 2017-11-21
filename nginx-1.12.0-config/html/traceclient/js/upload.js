/* upload */
window.alert=function(){};
$(function (){

});
/* 图片截取 */
var pictureCut = null; //存取图片路径
$("#clipArea").photoClip({
	width: 130,
	height: 136,
	file: "#file",
	view: "#view",
	ok: "#clipBtn",
	strictSize: true,
	/* 照片开始加载的回调函数 */
	loadStart: function() {
		console.log("照片读取中");
	},
	/* 照片加载完成的回调函数 */
	loadComplete: function() {
		console.log("照片读取完成");
	},
	/* 照片裁剪完成的回调函数 */
	clipFinish: function(dataURL) {
		console.log('裁剪完成!');
		pictureCut = dataURL;
	}
});
/* 点击 确认提交图片 */
$('#confirm').bind('click',function () {
	/* 无图片 */
	if (pictureCut === null) {
		console.log('请选择照片');
		$('#myModal').modal('show');
	}
	else {
		alert('裁剪完成!');
		$.ajax({
			url: 'http://10.88.20.51:8761/trc-service-enterprise/fileservice/upload',
			type: 'POST',
			data: {},
			success: function (data) {
				console.log(data);
			},
			error: function () {
				console.log('fail!');
			}
		})
	}
	/*  */
});
/*  点击裁剪 */
$('#clipBtn').bind('click', function () {

});
/* 点击取消 */
$('#cancel').bind('click', function () {
	window.opener=null;
	window.open('','_self');
	window.close();
});
/* 点击模态窗口的 确认按钮 关闭模态窗*/
$('#modal-close').bind('click',function(){
	$('#myModal').modal('hide');
});
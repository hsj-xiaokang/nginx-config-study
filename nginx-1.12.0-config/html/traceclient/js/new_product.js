/* 基本信息 */
$(function () {
	/* 上传图片获取图片名字 */
	$('[type="file"]').on('change', function () {
		console.log('图片改变!');
		var arrs=$(this).val().split('\\');
		var filename=arrs[arrs.length-1];
		$(".show-imageName").html(filename);
	});

	/* 选择日期插件初始化 */
	$('[name="productiondate"]').datetimepicker({
		format: 'yyyy-mm-dd', //显示格式
		minView:'month', //
		language: 'zh-CN', //语言
		autoclose:true, //选择一个日期之后是否立即关闭该选择器
		weekStart: 1 //一周从哪天开始
	});

	/*  富文本初始化 */
	$('.summernote').summernote({
		minHeight: 150,
		lang: 'zh-CN',
		/* 重写图片上传方法 */
		callbacks: {
			onImageUpload: function(file, editor, $editable) {
				sendFile(file, editor, $editable);
			}
		}
	});
	$('.note-codable').hide();

	/*******************************  地址四级联动 **************************************/

	/* 通过上一步按钮返回时 获取数据 */
	if (sessionStorage.getItem('sessionAddress') && $('[name="productionname"]').val().length > 0) {
		setData();
	}
	else {
		/* 进入页面就获取省份数据 */
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
					sessionStorage.setItem('province', JSON.stringify(data.data));
				}
			},
			error: function (){
				console.log('查询地址失败!');
				$('.province-produce').append('<option>暂无数据</option>');
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

					sessionStorage.setItem('city', JSON.stringify(data.data));
				}
			},
			error: function (){
				console.log('查询地址失败!');
				$('.city-produce').html('<option>暂无数据</option>');
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

					sessionStorage.setItem('area', JSON.stringify(data.data));
				}
			},
			error: function (){
				console.log('查询地址失败!');
				$('.area-produce').html('<option>暂无数据</option>');
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

					sessionStorage.setItem('street', JSON.stringify(data.data));
				}
			},
			error: function (){
				console.log('查询地址失败!');
				$('.street-produce').html('<option>暂无数据</option>');
			}
		});
	});

	/***********************************************************************************************/

	/* 点击弹出框的 '确定' 关闭弹出框 */
	$('.modal-button').on('click', function () {
		$('#myModal-error').modal('hide');
	});
	$('.upload-image-cancel').on('click', function () {
		$('#myModal-upload').modal('hide');
		$('.upload-error').hide();
	});


	/* 点击图片上传时 */
	$('.upload-wrapper').on('click', function () {
		window.open('upload_image.html?selector=' +$(this).attr('id'))
	});

	/* 点击视频 */
	$('.upload-movie-wrapper').on('click', function () {
		$('#myModal-upload').modal('show');
	});

	/* 解决bootstrap 点击下拉菜单隐藏的问题 */
	$('.dropdown').on('click', '[data-stopPropagation]', function (even) {
		even.stopPropagation();
	});


	/* 下拉菜单的隐藏和显示	 */
	$('#tree-input').on('focus', function () {
		$('#dropdown-menu').show();
		console.log('获取焦点!');
	});

	$('body').on('click', function (e) {
		if (e.target.id === 'tree-input') {
			console.log('点击了input');
		}
		else {
			$('#dropdown-menu').hide();
		}
	});

	/* 获取地块数据 */
	getLand();

	/* 新增 购买链接地址 */
	$('.shop-add').on('click', function () {
		var maxShopNumber = 8;  // 店铺最大添加个数
		/* 计算店铺个数 */
		var shopLength = $('.shop-main .shop').length + 1;

		if (shopLength === maxShopNumber + 1){
			/* 按钮置灰*/
			return;
		}

		var template =  '<div class="col-md-12  col-md-12 col-sm-12 col-xs-12 shop">'+
						'	<div class="col-lg-7 col-md-8 col-sm-9 col-xs-12">'+
						'		<div class="input-group">'+
						'			<div class="input-group-addon shop-number">店铺<span>'+shopLength+'</span>:</div>'+
						'			<div onclick="shopIconUpload('+shopLength+')" class="input-group-addon shop-icon shop-icon-four" id="shop-icon-'+shopLength+'"></div>'+
						'			<div class="shop-name-wrapper">' +
						'				<input class="form-control" value="" placeholder="请输入店铺名称"/>'+
						'			</div>		' +
						'		</div>'+
						'	</div>'+
						'	<div class="col-lg-7 col-md-8 col-sm-9 col-xs-12">'+
						'		<div class="input-group">'+
						'			<div class="input-group-addon shop-path">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>'+
						'			<input class="form-control" placeholder="请输入店铺地址"/>'+
						'		</div>'+
						'	</div>'+
						'</div>';

		$('.shop-main').append(template);
	});


	/* 店铺图标上传 */
	$('.shop-icon').on('click', function () {
		window.open('upload_image.html?selector=' + $(this).attr('id'));
	});

	/* 检测产品名称是否重复 */
	var productionnameIsRepeat = false;  //是否重名
	$('[name="productionname"]').on('blur', function () {
		if ($(this).val().length > 0) {
			$.ajax({
				url: productNameFlag,
				type: 'POST',
				dataType: 'json',
				data: {
					productionname: $(this).val(),
					operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
					lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
				},
				success: function (data) {
					console.log(data);
					if (data.flag === 1 && data.data.totalCount === 0) {
						$('.productionname-error').text('').hide();
						productionnameIsRepeat = false;
						return;
					}
					else {
						/*$('.errorInfo').text('产品名称不能重复');
						 $('#myModal').modal('show');*/
						$('.productionname-error').text('产品名称重复').show();
						productionnameIsRepeat = true;
						return;
					}
				},
				error: function () {
					console.log('检测名字失败!');
					return;
				}
			});
		}
	});

	/* 点击下一步  */
	$('.form-save div').on('click', function () {

		/* 设置店铺默认图标地址 */
		setShopIconPath();
		/* 清除错误提示 */
		$('.productionname-error,.productionspec-error,.address-error,.productionaddress-error,.mainnutrients-error,.foodadditives-error,.pictureURL-error').hide();

		/* 获取表单value */
		var productionname = $('[name="productionname"]').val().trim(); //产品名称
		var productionspec = $('[name="productionspec"]').val().trim(); //产品规格
		var archiveLinkList = []; //店铺

		/* 获取销售渠道数据 */
		for (var i=0; i<$('.shop-main .shop').length; ++i) {
			var name = $('.shop-main .shop').eq(i).find('input').eq(0).val().trim();  //店铺名字
			var url = $('.shop-main .shop').eq(i).find('input').eq(1).val().trim();  //店铺链接地址
			var icourl = $('.shop-icon').eq(i).attr('data-src'); //店铺图标

			if (name.length === 0  || url.trim().length === 0  || icourl.length === 0 ) continue;

			var currentArchiveLinkList = {
				id: i,
				name: name,
				url: url,
				icourl: icourl
			};
			archiveLinkList.push(currentArchiveLinkList);
		}

		//生产地址
		var productionaddressid = $('.street-produce').val() || $('.area-produce').val() || $('.city-produce').val() || $('.province-produce').val();
		var productionaddress = $('[name="productionaddress"]').val().trim(); //补充的生产地址
		var landid = $('#tree-input').val() === '' ? '' : ($('#tree-input').attr('data-value')); //地块选择
		var productionstandardno = $('[name="productionstandardno"]').val().trim(); //标准证
		var productionlicenceno = $('[name="productionlicenceno"]').val().trim(); //许可证
		var qualitymanager = $('[name="qualitymanager"]').val().trim(); //质量负责人
		var mainnutrients = $('[name="mainnutrients"]').val().trim(); //主要营养成分
		var fhcertificateno = $('[name="fhcertificateno"]').val().trim(); //食卫证号
		var productionbrand = $('[name="productionbrand"]').val().trim(); //品牌
		var productiondate = $('[name="productiondate"]').val().trim(); //生产日期
		var foodadditives = $('[name="foodadditives"]').val().trim(); //食品添加剂
		var videopath = $('.upload-movie-wrapper video').attr('src') || ''; //产品主视频
		var picture1URL = $('[id="picture1URL"]').attr('data-src') || ''; //示例图1
		var picture2URL = $('[id="picture2URL"]').attr('data-src') || ''; //示例图2
		var picture3URL = $('[id="picture3URL"]').attr('data-src') || ''; //示例图3
		var description = $('.summernote').summernote('code'); //详细描述
		/* 判断数据合法性 */

		if (productionname.length === 0) {
			$('.productionname-error').text('请输入产品名称').show();
			/*$('.errorInfo').text('请输入产品名称');
			 $('#myModal-error').modal('show');*/
			return;
		}
		/* 重名 */
		if (productionnameIsRepeat) {
			$('.productionname-error').text('产品名称重复').show();
			return;
		}
		if (productionspec.length === 0) {
			/*$('.errorInfo').text('请输入产品规格');
			 $('#myModal-error').modal('show');*/
			$('.productionspec-error').text('请输入产品规格').show();
			return;
		}
		if (productionaddressid.length === 0) {
			/*$('.errorInfo').text('请选择生产地址');
			 $('#myModal-error').modal('show');*/
			$('.address-error').text('请选择生产地址').show();
			return;
		}
		if (mainnutrients.length === 0) {
			/*$('.errorInfo').text('请填写主要营养成分');
			 $('#myModal-error').modal('show');*/
			$('.mainnutrients-error').text('请填写营养成分').show();
			return;
		}
		if (foodadditives.length === 0) {
			/*$('.errorInfo').text('请填写食品添加剂');
			 $('#myModal-error').modal('show');*/
			$('.foodadditives-error').text('请填写食品添加剂').show();
			return;
		}
		if ( !picture1URL && !picture2URL && !picture3URL ) {
			$('.pictureURL-error').text('请上传示例图').show();
			return;
		}
		/* 提交表单 */
		console.log(picture1URL);
		console.log(picture2URL);
		console.log(picture3URL);
		console.log('videopath = ' + videopath);
		console.log('landid = ' + landid);
		/* 跳转到下一步 */
		/* 存储数据 */
		var productInfo = {
			/*operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			 enterpriseid: sessionStorage.getItem('enterpriseid'),*/
			type: getQueryString('type'),
			secondtype: getQueryString('secondtype'),
			productionname: productionname,
			productionspec: productionspec,
			productionaddressid: productionaddressid,
			productionaddress: productionaddress,
			landid: landid,
			productionstandardno: productionstandardno,
			productionlicenceno: productionlicenceno,
			qualitymanager: qualitymanager,
			mainnutrients: mainnutrients,
			fhcertificateno: fhcertificateno,
			productionbrand: productionbrand,
			productiondate: productiondate,
			foodadditives: foodadditives,
			picture1URL: picture1URL,
			picture2URL: picture2URL,
			picture3URL: picture2URL,
			videopath: videopath,
			description: description,
			archiveLinkList: JSON.stringify(archiveLinkList)  //店铺
		};
		sessionStorage.setItem('productInfo', JSON.stringify(productInfo));
		var sessionAddress = {
			province: $('.province-produce').val(),
			city: $('.city-produce').val(),
			area: $('.area-produce').val(),
			street: $('.street-produce').val()
		};
		sessionStorage.setItem('sessionAddress', JSON.stringify(sessionAddress));

		/* 视频、图片 */
		var sessionPictureAndVideo = {
			videopath: videopath,
			picture1URL: picture1URL,
			picture2URL: picture2URL,
			picture3URL: picture3URL
		};
		sessionStorage.setItem('sessionPictureAndVideo', JSON.stringify(sessionPictureAndVideo));

		/* 富文本 */
		sessionStorage.setItem('sessionDescription', $('.summernote').summernote('code'));

		/* 店铺 */
		sessionStorage.setItem ('sessionShopStructure', $('.shop-main').html());
		sessionStorage.setItem ('sessionShopData', JSON.stringify(archiveLinkList));

		/*  */
		window.name = 0; //用于计算 进入new_product2.html页面时 是否是从这个页面进入
		window.location.href = 'new_product2.html';
	});
});


/* tree不显示图标 */
function showIconForTree(treeId, treeNode) {
	return !treeNode.isParent;
}

/* 选中tree 赋值给input框 */
function onClick(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj('dropdown-menu'),
		nodes = zTree.getSelectedNodes(),
		v = '',
		jforgid = '';
	nodes.sort(function compare(a,b){return a.id-b.id;});
	for (var i=0, l=nodes.length; i<l; i++) {
		v += nodes[i].name + ',';
		jforgid += nodes[i].jforgid;
	}
	if (v.length > 0 ) v = v.substring(0, v.length-1);
	$('#tree-input').val(v).attr('data-value', jforgid);
	$('#dropdown-menu').hide();
}

/* tree 设置不能选择文件夹 */
function beforeClick(treeId, treeNode) {
	var check = (treeNode && !treeNode.isParent);
	if (!check) return check;
}

//还原zTree的初始数据
function InitialZtree() {
	$.fn.zTree.init($('#dropdown-menu'), setting, zNodes);
}

/* tree 模糊搜索 */
///根据文本框的关键词输入情况自动匹配树内节点 进行模糊查找
function autoMatch(txtObj) {
	if (txtObj.value.length > 0) {
		InitialZtree();
		var zTree = $.fn.zTree.getZTreeObj('dropdown-menu');
		var nodeList = zTree.getNodesByParamFuzzy('name', txtObj.value);
		//将找到的nodelist节点更新至Ztree内
		$.fn.zTree.init($('#dropdown-menu'), setting, nodeList);
		/*showMenu();*/
	}
	else {
		//隐藏树
		//hideMenu();
		InitialZtree();
	}
}

//图片上传  
function sendFile(file, editor, $editable){
	/*var filename = false;
	try{
		filename = file['name'];
	} 
	catch(e){
		filename = false;
	}
	if(!filename){
		$(".note-alarm").remove();
	}
*/
	//以上防止在图片在编辑器内拖拽引发第二次上传导致的提示错误  
	data = new FormData();
	data.append("file", file[0]);
	$.ajax({
		url: uploadImage + '?operatorid=' + JSON.parse(sessionStorage.getItem('loginInfo')).uid + '&lastlogincode=' + JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode,
		data: data,
		type: "POST",
		cache: false,
		contentType: false,
		processData: false,
		success: function(data) {
			console.log('上传成功!');
			console.log(data);
			if (data.flag === 1 && data.data[0]) {
				/* 富文本中插入图片 */
				$('#summernote').summernote('insertImage', data.data[0],function ($image) {
					$image.css('maxWidth', '100%');
				});
			}
		},
		error:function(){
			console.log('图片上传失败!');
			return;
		}
	});
}

/* 返回上一步 设置页面数据 */
function setData () {
	/* 设置生产地址 */
	var sesssionAddress = JSON.parse(sessionStorage.getItem('sessionAddress'));
	var allProvince = JSON.parse(sessionStorage.getItem('province'));
	var allCity = JSON.parse(sessionStorage.getItem('city'));
	var allArea = JSON.parse(sessionStorage.getItem('area'));
	var allStreet = JSON.parse(sessionStorage.getItem('street'));

	/* 省 */
	var provinceHtml = '<option value="">--请选择--</option>';
	for (province of allProvince) {
		provinceHtml += '<option value="'+province.code+'">'+province.name+'</option>';
	}
	$('.province-produce').append(provinceHtml);
	$('.province-produce option[value="'+sesssionAddress.province+'"]').attr('selected',true);

	/* 市 */
	var cityHtml = '<option value="">--请选择--</option>';
	for (city of allCity) {
		cityHtml += '<option value="'+city.code+'">'+city.name+'</option>';
	}
	$('.city-produce').append(cityHtml);
	$('.city-produce option[value="'+sesssionAddress.city+'"]').attr('selected',true);
	$('.city-produce').show();
	
	/* 县 */
	var areaHtml = '<option value="">--请选择--</option>';
	for (area of allArea) {
		areaHtml += '<option value="'+area.code+'">'+area.name+'</option>';
	}
	$('.area-produce').append(areaHtml);
	$('.area-produce option[value="'+sesssionAddress.area+'"]').attr('selected',true);
	$('.area-produce').show();
	/* 镇 */
	var streetHtml = '<option value="">--请选择--</option>';
	for (street of allStreet) {
		streetHtml += '<option value="'+street.code+'">'+street.name+'</option>';
	}
	$('.street-produce').append(streetHtml);
	$('.street-produce option[value="'+sesssionAddress.street+'"]').attr('selected',true);
	$('.street-produce').show();

	/* 设置图片 */
	var videopath = JSON.parse(sessionStorage.getItem('sessionPictureAndVideo')).videopath;
	var picture1URL = JSON.parse(sessionStorage.getItem('sessionPictureAndVideo')).picture1URL;
	var picture2URL = JSON.parse(sessionStorage.getItem('sessionPictureAndVideo')).picture2URL;
	var picture3URL = JSON.parse(sessionStorage.getItem('sessionPictureAndVideo')).picture3URL;
	var description = sessionStorage.getItem('sessionDescription');

	$('.upload-movie-wrapper video').attr('src', videopath); //产品主视频

	if (picture1URL){
		$('[id="picture1URL"]').attr('data-src', picture1URL)
		.css('background-image','url('+picture1URL+')')
		.css('background-size','cover');
	}
	if (picture2URL) {
		$('[id="picture2URL"]').attr('data-src', picture2URL)
		.css('background-image','url('+picture2URL+')')
		.css('background-size','cover');
	}
	if (picture3URL) {
		$('[id="picture3URL"]').attr('data-src', picture3URL)
		.css('background-image','url('+picture3URL+')')
		.css('background-size','cover');
	}

	/* 设置富文本 */
	$('.summernote').summernote('code', description);

	/* 设置店铺 */
	$('.shop-main').html(sessionStorage.getItem('sessionShopStructure')); //设置店铺结构
	var shopArr = JSON.parse(sessionStorage.getItem('sessionShopData')); //店铺数据
	if (sessionStorage.getItem('sessionShopData')) {
		for (var shop of shopArr) {
			if (shop.icourl.indexOf('http://') === -1) {
				shop.icourl = '../img/enterprise/new_product/' + shop.icourl;
			}
			$('.shop-main .shop').eq(shop.id).find('input').eq(0).val(shop.name);  //店铺名字
			$('.shop-main .shop').eq(shop.id).find('input').eq(1).val(shop.url);  //店铺链接地址
			$('.shop-main .shop').eq(shop.id).find('.shop-icon').css('background-image','url('+shop.icourl+')')// 店铺图标
		}
	}
}

/* 获取地块数据 */
var setting = {};
var zNodes = [];
function getLand () {
	console.log('获取地块数据');
	$.ajax({
		url: land,
		type: 'GET',
		dataType: 'JSON',
		success: function (data) {
			console.log('获取地块数据成功!');
			console.log(data);
			if (data.items) {
				setting = {
					view: {
						showIcon: showIconForTree
					},
					data: {
						simpleData: {
							enable: true
						}
					},
					callback: {
						beforeClick: beforeClick,
						onClick: onClick
					}
				};
				zNodes =[];
				for (var item of data.items) {
					var currentLand = {
						id: item.id,
						pId: item.parentorgid,
						name: item.orgname,
						jforgid: item.jforgid
					};
					zNodes.push(currentLand);
				}
				$.fn.zTree.init($('#dropdown-menu'), setting, zNodes);
			}

		},
		error: function (error) {
			console.log('获取地块数据失败!');
		}
	});
}


/* 店铺图标 */
function shopIconUpload (num) {
	window.open('upload_image.html?selector=shop-icon-' + num);
}

/* 设置默认店铺图标地址 */
function setShopIconPath () {
	for (var i=0; i<$('.shop-main .shop').length; ++i) {
		/* 图片地址 */
		if ($('.shop-icon').eq(i).attr('data-src')) continue;

		var iconPath = $('.shop-icon').eq(i).css('backgroundImage').replace('url(','').replace(')','').replace('"', '').replace('"', '');
		var iconNameIndex = iconPath.lastIndexOf('/') + 1;  // 图标名字索引开始
		var iconNameEnd = iconPath.length; //图标名字索引结束
		var iconName = iconPath.substring(iconNameIndex, iconNameEnd);
		$('.shop-icon').eq(i).attr('data-src', iconName);
	}
}




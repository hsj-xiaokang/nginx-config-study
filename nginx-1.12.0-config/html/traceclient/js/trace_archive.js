

$(function () {

	/* 产销过程按钮点击事件 */
	$('.stepImage').eq(0).css('background-image','url(./img/trace_archive/s2_a.png)');  //默认显示第一步的图片
	$('.stepImage').click(function () {
		$(this).addClass('active');
		$(this).siblings('.stepImage').removeClass('active');
		$(this).parent().siblings('.step').children('.stepImage').removeClass('active');
		$(this).siblings('.stepImage').css('background-image','url(./img/trace_archive/s1_a.png)');
		$(this).parent().siblings('.step').children('.stepImage').css('background-image','url(./img/trace_archive/s1_a.png)');

	});
	/* 产销过程按钮鼠标滑入滑出事件 */
	$('.stepImage').hover(  //s2绿色  s1灰色
		function () {
			$(this).css('background-image','url(./img/trace_archive/s2_a.png)');
		},
		function () {
			if ($(this).hasClass('active')) {
				return;
			}
			$(this).css('background-image','url(./img/trace_archive/s1_a.png)');
		}
	);

	/* 获取产品档案详情 */
	getDetailedProduct();

	/* 设置页面导航路径 */
	setPagePath();
});

/* 获取产品档案详情 */
function getDetailedProduct() {
	$.ajax({
		url: detailedProduct,
		type: 'POST',
		dataType: 'json',
		data: {id: getQueryString('id')},
		success: function (data) {
			console.log('获取产品档案详情成功!');
			console.log(data);
			if (data.flag === 1 && data.data) {
				setPageData(data.data);

			}
		},
		error: function () {
			console.log('获取产品档案详情失败!');
		},
		/* 查询一次防伪码 */
		complete: function () {
			if (getQueryString('traceNoOrFakeNo')) {
				$.ajax({
					url: searchFackCode,
					type: 'POST',
					dataType: 'json',
					data: {traceNoOrFakeNo: getQueryString('traceNoOrFakeNo')},
					success: function () {
						console.log('扫描成功!');
					},
					error: function () {
						console.log('扫描失败!');
					}
				});
			}
		}
	});
}

/* 根据返回的数据设置页面数据 */
var processList = []; //产销过程数组
function setPageData (data) {

	/* 扫描次数 */
	if (/^[1-9]\d*$/.test(getQueryString('scantimes')) ) {
		$('.scan-number span').text(getQueryString('scantimes'));
		$('.scan-number').show();
	}

	/* 头部企业 logo 名称 */
	$('.company-name-wrapper img').attr('src', data.enterpriseInfo.logoiamge);
	$('.company-name-wrapper span').text(data.enterpriseInfo.enterprisename);

	/* 点击跳转 */
	$('.company-name-wrapper a').attr('href','enterprise_index.html?enterpriseid=' + data.enterpriseInfo.enterpriseid);


	/* 供GIS页面调用 */
	sessionStorage.setItem('enterpriseInfo',JSON.stringify(data.enterpriseInfo));

	/*  跳转至 GIS 页面*/
	if (data.landid){
		$('.reality').show();
		$('.reality').on('click', function () {
			window.location.href = 'production_gis.html?landid=' +data.landid;
		});
	}
	else $('#products-real-status-wrapper').hide();


	/* 产品信息 */
	$('.products-info-img img').attr('src', data.picture);
	$('.productInfoName').text(data.productionname);
	$('#table-productInfo tr').eq(0).children().eq(1).text(data.productionspec);
	$('#table-productInfo tr').eq(1).children().eq(1).text(data.productionbrand);
	var proproductiondate = data.productiondate ? data.productiondate.substring(0,11) : '';
	$('#table-productInfo tr').eq(2).children().eq(1).text(proproductiondate);
	$('#table-productInfo tr').eq(3).children().eq(1).text(data.fhcertificateno);
	$('#table-productInfo tr').eq(4).children().eq(1).text(data.productionbatchno);
	$('#table-productInfo tr').eq(5).children().eq(1).text(data.productionlicenceno);
	$('#table-productInfo tr').eq(6).children().eq(1).text(data.qualitymanager);
	$('#table-productInfo tr').eq(7).children().eq(1).text(data.mainnutrients);
	$('#table-productInfo tr').eq(8).children().eq(1).text(data.foodadditives);
	$('#table-productInfo tr').eq(9).children().eq(1).text(data.enterpriseInfo.productionAddressDetail);

	/* 店铺 */
	if (data.archiveLinkList) {
		/* 图标路径处理 */
		var template = '';
		for (var archiveLink of data.archiveLinkList) {
			if(archiveLink.icourl.indexOf('http://') === -1){
				/* ./img/enterprise/new_product/taobao.png */
				archiveLink.icourl = './img/enterprise/new_product/' + archiveLink.icourl;
			}
			template += '<div>'+
							'<div class="archiveLink-img" style="background-image: url(' + archiveLink.icourl + ')"></div>'+
							'<div class="archiveLink-text"><a href="'+archiveLink.url+'" target="_black">'+archiveLink.name+'</a></div>'+
						'</div>'
		}
		$('.archiveLink-wrapper').html(template);
		$('.archiveLink-wrapper').show();
	}
	//产销图片
	if (data.marketingProcessList) {
		/*$('.products-background-wrapper').show();
		$('#products-controller-img img').attr('src',data.marketingProcessList[0].resourcepath);
		for (var i=0; i<data.marketingProcessList.length; ++i) {
			if (i >= 5) {
				$('#products-controller-step li').eq(i*2-1).text(data.marketingProcessList[i].stepname);

			}
			else {
				$('#products-controller-step li').eq(i*2).text(data.marketingProcessList[i].stepname);
			}
		}
		if (data.marketingProcessList.length <= 5) {
			for (var k=16; k >= data.marketingProcessList.length * 2 - 1; --k) {
				$('.fengexian').hide();
				$('#products-controller-step li').eq(k).hide();
			}
		}
		else {
			for (var k=16; k >= data.marketingProcessList.length * 2 - 2; --k) {
				$('#products-controller-step li').eq(k).hide();
			}
		}
		/!* 产销过程图片更换 *!/
		$('.stepImage').on('click', function () {
			$('#products-controller-img img').attr('src',data.marketingProcessList[($(this).index('.stepImage'))].resourcepath); //产销图片
		});*/

		/* v2.0 */
		/* 设置时间轴数据 */
		processList = data.marketingProcessList;
		$('.products-background-wrapper').show();
		var template = '';
		for (var i=0; i<data.marketingProcessList.length; ++i) {
			//步骤名称
			//时间 step-list-wrapper

			template += '<div class="step-list" id="step-list-'+i+'">'+
						'	<div class="up-text">'+data.marketingProcessList[i].stepname+'</div>'+
						'	<div class="yuan">'+
						'		<div onclick="cutStep('+i+')"></div>'+
						'	</div>'+
						'	<div class="down-text">'+data.marketingProcessList[i].workeddate.substring(0,11)+'</div>'+
						'</div>';
		}
		$('.step-list-wrapper').html(template);
		$('.yuan>div').eq(0).css('border-color','#15b2ec');
		$('.up-text').eq(0).css('font-size','20px').css('color','#666666');
		//var wrapperWidth = $('.process-image-step').width();
		//$('.step-list').width(wrapperWidth / data.marketingProcessList.length); //设置宽度

		/* step 滚动 */
		$('.step-list-wrapper').mCustomScrollbar(
			{
				set_width: false,
				set_height: false,
				horizontalScroll: true,
				scrollButtons:{

					enable: false //滚动条两端按钮支持

				},

				theme: 'dark-thin'
			}
		);
		$('.mCSB_draggerContainer').css('display', 'none'); //隐藏滚动条 mCSB_scrollTools
		//$('.step-list-wrapper').mCustomScrollbar('disable',true); //滚动条不可用
		showImage(data.marketingProcessList[0]); /* 设置第一步图片 */
		setStepIconStatus(); /* 设置步骤条两端按钮的显示隐藏状态 */
		$('.process-image-text').text(data.marketingProcessList[0].workedcontent);

		/* 手机端左右箭头切换功能 */
		cutFirstImage(processList);
	}

	/* 产品认证 */
	if (data.productionAuthenticationList) {
		$('.products-attestation-wrapper').show();
		var templateAuthentication = '';
		for (var productionAuthentication of data.productionAuthenticationList) {
			templateAuthentication += 	'<div class="col-lg-1-5 col-md-1-5 col-sm-1-5 col-xs-1-5">'+
				'	<div class="smallImage-wrapper">'+
				'		<div>'+
				'			<img src="'+productionAuthentication.productCertificationMarkPicture+'"/>'+
				'		</div>'+
				'		<div>'+productionAuthentication.authenticationname+'</div>'+
				'	</div>'+
				'</div>'
		}
		$('.products-attestation-smallImage').html(templateAuthentication);
		$('.smallImage-wrapper').eq(0).addClass('smallImage-active');
		/* 产品认证图片更换 */
		$('.products-attestation-bigImage img').attr('src',data.productionAuthenticationList[0].productCertificationPicture);
		$('.smallImage-wrapper').on('click', function () {
			$('.products-attestation-bigImage img').attr('src',data.productionAuthenticationList[$(this).index('.smallImage-wrapper')].productCertificationPicture);
			/* 样式 */
			$(this).addClass('smallImage-active');
			$(this).parent().siblings().children('.smallImage-wrapper').removeClass('smallImage-active');
		});
	}

	/* 企业描述 */
	$('.description-wrapper').html(data.description);

	/* 企业信息 */
	$('.enterprise-info-body tr').eq(0).children().eq(1).text(data.enterpriseInfo.enterprisename); //民称
	$('.enterprise-info-body tr').eq(1).children().eq(1).text(data.enterpriseInfo.enterpriseAddressDetail); //法定地址
	$('.enterprise-info-body tr').eq(2).children().eq(1).text(data.enterpriseInfo.owner); //企业负责人
	$('.enterprise-info-body tr').eq(3).children().eq(1).text(data.enterpriseInfo.enterprisephone); //联系方式
	$('.enterprise-info-body tr').eq(4).children().eq(1).text(data.enterpriseInfo.enterpriseprofile); //企业简介
	$('.enterprise-info-body tr').eq(5).children().eq(1).text(data.enterpriseInfo.scope); //业务范围

	if (data.enterpriseInfo.serviceinformation) {
		$('.enterprise-info-body tr').eq(6).children().eq(1).text(data.enterpriseInfo.serviceinformation); //服务信息
	}
	else {
		$('.enterprise-info-body tr').eq(6).hide(); //服务信息
	}

	/* 企业资质 */
	if (data.enterpriseQualificationsList) {
		$('.products-natural-wrapper').show();
		var templateNatural = '';
		for (var enterpriseQualifications of data.enterpriseQualificationsList) {
			templateNatural += 	'<div class="col-lg-1-5 col-md-1-5 col-sm-1-5 col-xs-1-5">'+
								'	<div class="smallImage-wrapper-natural">'+
								'		<div>'+
								'			<img src="'+enterpriseQualifications.enterpriseCertificationMarkPicture+'"/>'+
								'		</div>'+
								'		<div>'+enterpriseQualifications.name+'</div>'+
								'	</div>'+
								'</div>'
		}
		$('.products-natural-smallImage').html(templateNatural);
		$('.smallImage-wrapper-natural').eq(0).addClass('smallImage-active');
		/* 企业资质图片更换 */
		$('.products-natural-bigImage img').attr('src',data.enterpriseQualificationsList[0].enterpriseCertificationPicture);
		$('.smallImage-wrapper-natural').on('click', function () {
			$('.products-natural-bigImage img').attr('src',data.enterpriseQualificationsList[$(this).index('.smallImage-wrapper-natural')].enterpriseCertificationPicture);
			/* 样式 */
			$(this).addClass('smallImage-active');
			$(this).parent().siblings().children('.smallImage-wrapper-natural').removeClass('smallImage-active');
		});
	}

	/* 企业视频 */
	if (true) {
		$('.enterprise-movie-wrapper').show();
		$('.enterprise-movie-wrapper video').attr('src', data.enterpriseInfo.videopath);
	}
}

/* 设置页面导航路径 */
function setPagePath () {
	var path = sessionStorage.getItem('pagePath');
	console.log('path = ' + path);
	var template = ''; // 页面路径导航字符串
	if (!path) return;
	switch (path) {
		case '精选产品' :
			template = 	'<li><a href="index.html">首页</a></li>'+
						'<li><a href="good_product.html">精选产品</a></li>'+
						'<li id="current-page">产品档案</li>';
		break;

		case '用户中心' :
		template = 	'<li><a href="index.html">首页</a></li>'+
					'<li><a href="./enterprise/member_home.html">用户中心</a></li>'+
					'<li id="current-page">产品档案</li>';
		break;

		case '消息' :
			template = 	'<li><a href="index.html">首页</a></li>'+
						'<li><a href="./enterprise/member_home.html">用户中心</a></li>'+
						'<li><a href="./enterprise/message.html">消息</a></li>'+
						'<li id="current-page">产品档案</li>';
			break;

		case '全部产品' :
			template = 	'<li><a href="index.html">首页</a></li>'+
						'<li><a href="./enterprise/member_home.html">用户中心</a></li>'+
						'<li><a href="enterprise_product.html">全部产品</a></li>'+
						'<li id="current-page">产品档案</li>';
		break;

		case '首页' :
			template = 	'<li><a href="index.html">首页</a></li>'+
						'<li id="current-page">产品档案</li>';
		break;
	}
	$('#breadcrumb').html(template);
}

/* 产销过程显示图片 */
function showImage (arr) {

	if (!arr || arr.length === 0 || arr.resourceList.length === 0) return;
	var resourceList = arr.resourceList;
	var length = arr.resourceList.length;
	var template = '';
	
	/* 手机端 */
	if (isSmallSize()) {
		/*template =  '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 process-image-big" data-src="'+resourceList[0].resourcepath+'">'+
		 '	<img src="'+resourceList[0].resourcepath+'"/>'+
		 '</div>';
		 for (var i=0; i<length; ++i) {
		 if (i === 0) continue;
		 template += '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 process-image-big" data-src="'+resourceList[i].resourcepath+'" style="display:none;">'+
		 '	<img src="'+resourceList[i].resourcepath+'"/>'+
		 '</div>';
		 }*/
		if (length === 1) {
			template =  '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 process-image-big" data-src="'+resourceList[0].resourcepath+'">'+
						'	<img src="'+resourceList[0].resourcepath+'"/>'+
						'</div>';
		}
		if (length >=2 && length < 5) {
			for (var i=0; i<length; ++i) {
				if (i > 0) {
					template += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 process-image-big" data-src="'+resourceList[i].resourcepath+'" style="display:none;">'+
								'	<img src="'+resourceList[i].resourcepath+'"/>'+
								'</div>';
				}
				else {
					template += '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 process-image-big" data-src="'+resourceList[i].resourcepath+'">'+
								'	<img src="'+resourceList[i].resourcepath+'"/>'+
								'</div>';
				}

			}
		}
		if (length >= 5) {
			template =  '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 process-image-big" data-src="'+resourceList[0].resourcepath+'">'+
						'	<img src="'+resourceList[0].resourcepath+'"/>'+
						'</div>'+
						'<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 process-image-small process-image-small-1" data-src="'+resourceList[1].resourcepath+'" style="display:none">'+
						'	<img src="'+resourceList[1].resourcepath+'"/>'+
						'</div>'+
						'<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 process-image-small process-image-small-2" data-src="'+resourceList[2].resourcepath+'" style="display:none">'+
						'	<img src="'+resourceList[2].resourcepath+'"/>'+
						'</div>'+
						'<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 process-image-small process-image-small-3" data-src="'+resourceList[3].resourcepath+'" style="display:none">'+
						'	<img src="'+resourceList[3].resourcepath+'"/>'+
						'</div>'+
						'<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 process-image-small process-image-small-4" data-src="'+resourceList[4].resourcepath+'" style="display:none">'+
						'	<img src="'+resourceList[4].resourcepath+'"/>'+
						'</div>';

			for (var i=0; i<length; ++i) {
				if (i < 5) continue;
				template += '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 process-image-small" data-src="'+resourceList[i].resourcepath+'" style="display:none">'+
							'	<img src="'+resourceList[i].resourcepath+'"/>'+
							'</div>';
			}
		}

		/* 显示出左右箭头 */
		$('.arrow-left').show();
		$('.arrow-right').show();
	}
	/* 电脑端 */
	else {
		if (length === 1) {
			template = '<div style="background:#CCC;" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 process-image-big">'+
							'<div style="padding:0;" class="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-sm-offset-0 col-xs-12 col-xs-offset-0" data-src="'+resourceList[0].resourcepath+'">'+
							'	<img src="'+resourceList[0].resourcepath+'"/>'+
							'</div>'+
						'</div>';
		}
		if (length >=2 && length < 5) {
			for (var i=0; i<length; ++i) {
				if (i > 1) {
					template += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 process-image-big" data-src="'+resourceList[i].resourcepath+'" style="display:none;">'+
								'	<img src="'+resourceList[i].resourcepath+'"/>'+
								'</div>';
				}
				else {
					template += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 process-image-big" data-src="'+resourceList[i].resourcepath+'">'+
								'	<img src="'+resourceList[i].resourcepath+'"/>'+
								'</div>';
				}

			}
		}
		if (length >= 5) {
			template =  '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 process-image-big" data-src="'+resourceList[0].resourcepath+'">'+
						'	<img src="'+resourceList[0].resourcepath+'"/>'+
						'</div>'+
						'<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 process-image-small process-image-small-1" data-src="'+resourceList[1].resourcepath+'">'+
						'	<img src="'+resourceList[1].resourcepath+'"/>'+
						'</div>'+
						'<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 process-image-small process-image-small-2" data-src="'+resourceList[2].resourcepath+'">'+
						'	<img src="'+resourceList[2].resourcepath+'"/>'+
						'</div>'+
						'<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 process-image-small process-image-small-3" data-src="'+resourceList[3].resourcepath+'">'+
						'	<img src="'+resourceList[3].resourcepath+'"/>'+
						'</div>'+
						'<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 process-image-small process-image-small-4" data-src="'+resourceList[4].resourcepath+'">'+
						'	<img src="'+resourceList[4].resourcepath+'"/>'+
						'</div>';

			for (var i=0; i<length; ++i) {
				if (i < 5) continue;
				template += '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 process-image-small" data-src="'+resourceList[i].resourcepath+'" style="display:none">'+
							'	<img src="'+resourceList[i].resourcepath+'"/>'+
							'</div>';
			}
		}

		/* 隐藏左右箭头 */
		$('.arrow-left').hide();
		$('.arrow-right').hide();
	}
	$('#auto-loop').html(template);
	$('.process-image-number span').eq(0).text(length);

	 /* 调整边距 */
	 if (length > 1) {
		 $('.process-image-big').eq(0).css('padding-right','2px');
	 }

	/* 画廊初始化 */
	$('#auto-loop').lightGallery({

		loop:true,

		auto:true,

		pause:4000

		/* 所有配置参数 */
		// Elements
		// thumbnail   : true,  // Whether to display a button to show thumbnails.
		// caption     : false, // Enables image captions. Content is taken from "data-title" attribute.
		// captionLink : false, // Makes image caption a link. URL is taken from "data-link" attribute.
		// desc        : false, // Enables image descriptions. Description is taken from "data-desc" attr.
		// counter     : false, // Shows total number of images and index number of current image.
		// controls    : true,  // Whether to display prev/next buttons.
		//
		// // Transitions
		// mode   : 'slide',  // Type of transition between images. Either 'slide' or 'fade'.
		// useCSS : true,     // Whether to always use jQuery animation for transitions or as a fallback.
		// easing : 'linear', // Value for CSS "transition-timing-function" prop. and jQuery .animate().
		// speed  : 1000,     // Transition duration (in ms).
		//
		// // Navigation
		// hideControlOnEnd : false, // If true, prev/next button will be hidden on first/last image.
		// loop             : false, // Allows to go to the other end of the gallery at first/last img.
		// auto             : false, // Enables slideshow mode.
		// pause            : 4000,  // Delay (in ms) between transitions in slideshow mode.
		// escKey           : true,  // Whether lightGallery should be closed when user presses "Esc".
		//
		// // Mobile devices
		// mobileSrc         : false, // If "data-responsive-src" attr. should be used for mobiles.
		// mobileSrcMaxWidth : 640,   // Max screen resolution for alternative images to be loaded for.
		// swipeThreshold    : 50,    // How far user must swipe for the next/prev image (in px).
		//
		// // Video
		// vimeoColor    : 'CCCCCC', // Vimeo video player theme color (hex color code).
		// videoAutoplay : true,     // Set to false to disable video autoplay option.
		// videoMaxWidth : 855,      // Limits video maximal width (in px).
		//
		// // i18n
		// lang : { allPhotos: 'All photos' }, // Text of labels.
		//
		// // Callbacks
		// onOpen        : function() {}, // Executes immediately after the gallery is loaded.
		// onSlideBefore : function() {}, // Executes immediately before each transition.
		// onSlideAfter  : function() {}, // Executes immediately after each transition.
		// onSlideNext   : function() {}, // Executes immediately before each "Next" transition.
		// onSlidePrev   : function() {}, // Executes immediately before each "Prev" transition.
		// onBeforeClose : function() {}, // Executes immediately before the start of the close process.
		// onCloseAfter  : function() {}, // Executes immediately once lightGallery is closed.
		//
		// // Dynamical load
		// dynamic   : false, // Set to true to build a gallery based on the data from "dynamicEl" opt.
		// dynamicEl : [],    // Array of objects (src, thumb, caption, desc, mobileSrc) for gallery els.
		//
		// // Misc
		// rel          : false, // Combines containers with the same "data-rel" attr. into 1 gallery.
		// exThumbImage : false, // Name of a "data-" attribute containing the paths to thumbnails.

	});
}

/* 产销过程步骤切换 */
function cutStep (num) {
	/* 设置 currentStep值 */
	showImage(processList[num]);
	$('.yuan>div').eq(num).css('border-color','#15b2ec');
	$('.up-text').eq(num).css('font-size','20px');
	$('.down-text').eq(num).css('color','#000000');
	$('.yuan>div').eq(num).parents('.step-list').siblings().children('.yuan').children().css('border-color','#bfbfbf');
	$('.up-text').eq(num).parents('.step-list').siblings().children('.up-text').css('font-size','14px');
	$('.down-text').eq(num).parents('.step-list').siblings().children('.down-text').css('color','#666666');
	$('.process-image-text').text(processList[num].workedcontent);
}

/* 浏览器大小改变 */
$(window).resize(function() {

	/* step两端按钮的显示隐藏状态 */
	setStepIconStatus();

	var minWidth = 768;
	var width = $(this).width();
	var length = $('#auto-loop>div').length;


	if (length === 0) return;

	/* 小于768时只显示1张图片 */
	if (width <= minWidth) {
		/* 显示左右箭头 */
		$('.arrow-left').show();
		$('.arrow-right').show();
		if (length === 1) return;
		$('#auto-loop>div:not(:first-child)').hide();
		$('#auto-loop>div:first-child').removeClass('col-lg-6').removeClass('col-md-6').removeClass('col-sm-6').removeClass('col-xs-6');
		$('#auto-loop>div:first-child').addClass('col-lg-12').addClass('col-md-12').addClass('col-sm-12').addClass('col-xs-12');
	}
	/* 大于768时完整显示 */
	if (width > minWidth) {
		/* 隐藏左右箭头 */
		$('.arrow-left').hide();
		$('.arrow-right').hide();

		if (length === 1) return;

		if (length >=2 && length < 5) {
            $('#auto-loop>div').eq(0).show();
            $('#auto-loop>div').eq(1).show();
		}
		if (length >= 5) {
            $('#auto-loop>div').eq(0).show();
            $('#auto-loop>div').eq(1).show();
            $('#auto-loop>div').eq(2).show();
            $('#auto-loop>div').eq(3).show();
            $('#auto-loop>div').eq(4).show();
		}
		$('#auto-loop>div:first-child').removeClass('col-lg-12').removeClass('col-md-12').removeClass('col-sm-12').removeClass('col-xs-12');
		$('#auto-loop>div:first-child').addClass('col-lg-6').addClass('col-md-6').addClass('col-sm-6').addClass('col-xs-6');

	}

});

/* 判断是否是pc端 */
function isPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone",
		"SymbianOS", "Windows Phone",
		"iPad", "iPod"];
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}

/* 判断浏览器尺寸 */
function isSmallSize () {
	var minWidth = 768;
	var deviceSize = $(window).width();
	return deviceSize <= minWidth ? true : false;
}

/* 浏览器两端按钮的显示隐藏状态 */
function setStepIconStatus () {
	var isStepBlock = $('.mCSB_scrollTools').css('display') === 'block';
	/* 显示滚动条两端按钮 */
	if (isStepBlock) {
		$('.process-image-step').css('padding-left','25px').css('padding-right','25px');
		$('.step-leftIcon').show();
		$('.step-rightIcon').show();
	}
	else {
		$('.process-image-step').css('padding','0px');
		$('.step-leftIcon').hide();
		$('.step-rightIcon').hide();
	}
}

/* 点击左右箭头切换每个步骤的第一张图片 */
var currentStep = 0; //当前步骤
function cutFirstImage (processList) {
	if (!processList || processList.length === 0) return;

	var maxStep = processList.length; //maxStep
	/* 点击图片左边的箭头 */
	$('.arrow-left').on('click', function () {
		--currentStep;
		if (currentStep === -1) currentStep = maxStep -1;
		cutStep([currentStep]);
		$('.step-list-wrapper').mCustomScrollbar('scrollTo', '#step-list-' + currentStep); //滚动至某个元素
	});

	/* 点击图片右边的箭头 */
	$('.arrow-right').on('click', function () {
		++currentStep;
		if (currentStep === maxStep) currentStep = 0;
		cutStep([currentStep]);
		$('.step-list-wrapper').mCustomScrollbar('scrollTo', '#step-list-' + currentStep); //滚动至某个元素
	});

	/* 点击步骤条上面的左右箭头 ? */
	$('.step-leftIcon').on('click', function () {
		$('.step-list-wrapper').mCustomScrollbar('scrollTo', 'first');
	});
	$('.step-rightIcon').on('click', function () {
		$('.step-list-wrapper').mCustomScrollbar('scrollTo', 'last');
	});
}








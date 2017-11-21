
/* 加载banner */
(function loadCommonHtml () {
	var bannerPath = selectPath() ? '../common/html/banner.html' : 'common/html/banner.html';
	$('.top').load(bannerPath, function () {
		var userInfo = JSON.parse(sessionStorage.getItem('loginInfo'));

		/* 已经登录 */
		if (userInfo) {
			$('.user span').text(userInfo.username);
			/* 企业 */
			if (userInfo.countType === '企业用户') {
				if (selectPath()) {
					$('.user img').attr('src', '../img/banner/huiyuan.png'); //icon
					$('.user').attr('href', 'member_home.html'); //账户
					$('.banner-logo').attr('href', '../index.html'); //首页
					$('.banner-message').attr('href', 'message.html'); //消息

				}
				else {
					$('.user img').attr('src', 'img/banner/huiyuan.png');
					$('.user').attr('href', './enterprise/member_home.html');
					$('.banner-logo').attr('href', 'index.html');
					$('.banner-message').attr('href', './enterprise/message.html');
				}
			}
			/* 政府 */
			if (userInfo.countType === '政府用户') {
				$('.banner-message').hide();
				if (selectPath()) {
					$('.user img').attr('src', '../img/banner/huiyuan.png');
					$('.user').attr('href', 'government_home.html');
					$('.banner-logo').attr('href', '../index.html');
				}
				else {
					$('.user img').attr('src', 'img/banner/huiyuan.png');
					$('.user').attr('href', './government/government_home.html');
					$('.banner-logo').attr('href', 'index.html');
				}
			}
		}
		/* 未登录 */
		else {
			$('.user img').attr('src', 'img/banner/huiyuan.png');
			$('.user span').text('会员登录');
			$('.user').attr('href', 'member_login.html');
			$('.banner-logo').attr('href', 'index.html'); //首页
			$('.banner-message,.login-out').hide();
		}
	});
})();

/* 加载enterprise 头部 */
(function loadEnterpriseTopHtml () {
	if (window.location.href.indexOf('/enterprise/') > -1) {
		$('.page-top-wrapper').load('../common/html/enterprise_top.html', function () {
			getEnterpriseInfoToTop();

			/* 点击公司名字、logo跳转 */
			$('.logo-name a').attr('href', '../enterprise_index.html?enterpriseid=' + sessionStorage.getItem('enterpriseid'));
		});
	}
})();

/* 退出登录 */
function loginOut () {
	sessionStorage.removeItem('loginInfo');
	sessionStorage.removeItem('enterpriseid');
	if (selectPath()) {
		window.location.replace('../member_login.html');
	}
	else {
		window.location.replace('member_login.html');
	}

}


/* 地址栏路径 */
function selectPath () {
	if (window.location.href.indexOf('/enterprise/') > -1 || window.location.href.indexOf('/government/') > -1) {
		return true;
	}
	else return false;
}

/* 获取头部企业相关信息 */
function getEnterpriseInfoToTop() {
	$.ajax({
		url: enterpriseInfo,
		type: 'POST',
		dataType: 'json',
		data: {
			enterpriseid: sessionStorage.getItem('enterpriseid'),
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
		success: function (data) {
			console.log('获取企业logo、name成功!');
			console.log(data);
			if (data.flag === 1) {
				console.log(data);
				$('.logo-name img').attr('src', data.data.logoURL);
				$('.logo-name span').text(data.data.enterprisename);
				$('.enterprise-num>span>span').eq(1).text(data.data.unusedfakenumber);
				$('.enterprise-num>span span').eq(2).text(data.data.usedfakenumber);
			}
		},
		error: function () {
			console.log('获取企业logo、name失败!');
		}
	});
	$.ajax({
		url: productionCount,
		type: 'POST',
		dataType: 'json',
		data: {
			enterpriseid: sessionStorage.getItem('enterpriseid'),
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
		success: function (data) {
			console.log('获取已发布产品数量成功!');
			console.log(data);
			if (data.flag === 1) {
				$('.enterprise-num>span>span').eq(0).text(data.data.totalCount);
			}
		},
		error: function () {
			console.log('获取已发布产品数量失败!');
		}
	})
}

/* 加载菜单 */
(function loadMenu () {
	var menuPath = selectPath() ? '../common/html/enterprise_menu.html' : 'common/html/enterprise_menu.html';
	var currenAddressPath = window.location.href; //当前地址路径
	var memberHome = currenAddressPath.indexOf('member_home.html') > -1; //企业首页
	var newProduct = currenAddressPath.indexOf('new_product.html') > -1; //新建档案1
	var newProduct2 = currenAddressPath.indexOf('new_product2.html') > -1; //新建档案2
	var addfackcode = currenAddressPath.indexOf('addfackcode.html') > -1; //新增追溯码
	var baseInfo = currenAddressPath.indexOf('base_info.html') > -1; //基本信息
	var enterpriseNatural = currenAddressPath.indexOf('enterprise_natural.html') > -1 //企业资质
	var changePassword = currenAddressPath.indexOf('change_password.html') > -1; //账号安全
    var total = currenAddressPath.indexOf('total.html') > -1; //扫描统计

    var homeMenu = memberHome || newProduct || newProduct2 || addfackcode; //显示首页菜单

	var editMenu = baseInfo || enterpriseNatural || changePassword || total;

    $('#main-menu').load(menuPath, function () {
		if (homeMenu) {
			$('.menu-back-files').css('background-color', '#15b2ec');
			$('.menu-back-files a').css('color', '#FFF');
            $('.menu-back-files').css('background-image','url(../img/enterprise/home/zhuisu1.png)');

            /* 菜单鼠标进出 */
            $('.menu-edit,.menu-message').hover(
                function () {
                    $(this).css('background-color','#15b2ec');
                    $(this).find('a').css('color','#FFF');
                    if ($(this).find('a').text() === '资料编辑'){
                        $(this).css('background-image','url(../img/enterprise/home/bianji1.png)')
                    }
                    if ($(this).find('a').text().indexOf('消息') > -1){
                        $(this).css('background-image','url(../img/enterprise/home/xiaoxi1.png)')
                    }
                },
                function () {
                    $(this).css('background-color','#f5f7fa');
                    $(this).find('a').css('color','#000');
                    if ($(this).find('a').text() === '资料编辑'){
                        $(this).css('background-image','url(../img/enterprise/home/bianji.png)');
                    }
                    if ($(this).find('a').text().indexOf('消息') > -1){
                        $(this).css('background-image','url(../img/enterprise/home/xiaoxi.png)');
                    }
                }
            );
		}
        if (editMenu) {
            $('.menu-edit').css('background-color', '#15b2ec');
            $('.menu-edit a').css('color', '#FFF');
            $('.menu-edit').css('background-image','url(../img/enterprise/home/bianji1.png)');

            if (baseInfo) {
            	$('.menu-basic-info a').css('color', '#15b2ec');
			}
            if (enterpriseNatural) {
                $('.menu-company-natural a').css('color', '#15b2ec');
            }
            if (changePassword) {
                $('.menu-account-safe a').css('color', '#15b2ec');
            }
            if (total) {
                $('.menu-total a').css('color', '#15b2ec');
            }


            /* 菜单鼠标进出 */
            $('.menu-message,.menu-back-files').hover(
                function () {
                    $(this).css('background-color','#15b2ec');
                    $(this).find('a').css('color','#FFF');
                    if ($(this).find('a').text().indexOf('消息') > -1){
                        $(this).css('background-image','url(../img/enterprise/home/xiaoxi1.png)')
                    }
                    if ($(this).find('a').text() === '追溯档案'){
                        $(this).css('background-image','url(../img/enterprise/home/zhuisu1.png)')
                    }
                },
                function () {
                    $(this).css('background-color','#f5f7fa');
                    $(this).find('a').css('color','#000');
                    if ($(this).find('a').text() === '追溯档案'){
                        $(this).css('background-image','url(../img/enterprise/home/zhuisu.png)');
                    }
                    if ($(this).find('a').text().indexOf('消息') > -1){
                        $(this).css('background-image','url(../img/enterprise/home/xiaoxi.png)')
                    }
                }
            );
        }
        if (currenAddressPath.indexOf('message.html') > -1) {
            $('.menu-message').css('background-color', '#15b2ec');
            $('.menu-message a').css('color', '#FFF');
            $('.menu-message').css('background-image','url(../img/enterprise/home/xiaoxi1.png)');

            /* 菜单鼠标进出 */
            $('.menu-edit,.menu-back-files').hover(
                function () {
                    $(this).css('background-color','#15b2ec');
                    $(this).find('a').css('color','#FFF');
                    if ($(this).find('a').text() === '资料编辑'){
                        $(this).css('background-image','url(../img/enterprise/home/bianji1.png)')
                    }
                    if ($(this).find('a').text() === '追溯档案'){
                        $(this).css('background-image','url(../img/enterprise/home/zhuisu1.png)')
                    }
                },
                function () {
                    $(this).css('background-color','#f5f7fa');
                    $(this).find('a').css('color','#000');
                    if ($(this).find('a').text() === '资料编辑'){
                        $(this).css('background-image','url(../img/enterprise/home/bianji.png)');
                    }
                    if ($(this).find('a').text() === '追溯档案'){
                        $(this).css('background-image','url(../img/enterprise/home/zhuisu.png)')
                    }
                }
            );

        }

	});
})();


/* 加载alert */
(function loadAlert () {
	var alertPath = selectPath() ? '../common/html/alert.html' : 'common/html/alert.html';

	var alertLength = $('.alert-wrapper').length;

	if (alertLength === 0) $('body').append('<div class="alert-wrapper"></div>');

	$('.alert-wrapper').load(alertPath, function () {
        /* 点击弹出框的 '确定' 关闭弹出框 */
        $('.modal-button').on('click', function () {
            $('#myModal-error').modal('hide');
        });
	});
})();

/* 弹出方法 */
/**
 * content: 弹出内容
 */
function commonAlert (content) {
    $('.errorInfo').text(content);
    $('#myModal-error').modal('show');
}





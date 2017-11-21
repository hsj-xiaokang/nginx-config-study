$(function () {

	/* 头部企业 logo 名称 */
	$('.company-name-wrapper img').attr('src', JSON.parse(sessionStorage.getItem('enterpriseInfo')).logoiamge);
	$('.company-name-wrapper span').text(JSON.parse(sessionStorage.getItem('enterpriseInfo')).enterprisename);
	$('.company-name-wrapper a').attr('href', 'enterprise_index.html?enterpriseid=' +JSON.parse(sessionStorage.getItem('enterpriseInfo')).enterpriseid);

	/* 设置iframe地址 */
	//$('iframe').attr('src', 'http://220.164.82.48:6089/web.html?landid=' + getQueryString('landid')) //web视图
	// $('iframe').attr('src', 'http://220.164.82.48:6088/index.html?landid=' + getQueryString('landid')); // 列表视图
	// $('iframe').attr('src', 'http://220.164.82.48:6088/map.html?landid=' + getQueryString('landid')); //地图视图
	/* PC端 */

	$('iframe').attr('src', 'http://220.164.82.48:6089/web.html?landid=' + getQueryString('landid'))

});

/* 判断是否是PC端 */
function isPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];

	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}


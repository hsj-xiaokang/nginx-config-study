

/*  方法一: new Date() 获取的是系统时间 系统时间可更改. 这种做法是错误的 */

(function isTimeOut () {
	/* 获取上一次时间 */
	if (!sessionStorage.getItem('lastTime')) {
		sessionStorage.setItem('lastTime', new Date().getTime());
		console.log('第一次进入!');
	}
	else {
		var pastTime = parseInt(new Date().getTime()) - parseInt(sessionStorage.getItem('lastTime')); //相差的时间

		if (pastTime >= 30 * 60 * 1000) {
			console.log('已经超时!');
			sessionStorage.removeItem('lastTime');  //移除时间sessoin
			sessionStorage.removeItem('loginInfo')//移除登录session
			sessionStorage.removeItem('enterpriseid'); //移除enterpriesid session
			window.location.replace('../member_login.html');

		}
		else {
			sessionStorage.setItem('lastTime', new Date().getTime());
		}
	}
})();




/* 方法二: 每隔 一段时间 跳出登录 如重新加载页面则超时时间重新设置 */
/*(function (){
	/!* 超时时间 *!/
	var timeOut = 10 * 1000;

	var loginOutTime = 	setTimeout(loginOut, timeOut);

	/!* 重定向到登录界面 *!/
	function loginOut () {
		sessionStorage.removeItem('loginInfo'); //移除 登录 session
		sessionStorage.removeItem('enterpriseid'); //移除 enterpriesid session
		window.location.replace('../member_login.html');
	}

})();*/




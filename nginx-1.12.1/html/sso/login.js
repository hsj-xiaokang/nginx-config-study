/**
 * 
 */
var login = function(){
	$.ajax({
		url: 'http://www.cas.com:8080/cas/login? mode=rlogin&service=http://www.ssoclient.com:8080/demo-web/ssoresult.do',
		dataType: "jsonp",
		jsonpCallback: "jsonpcallback",
		success: function (data) { $('#lt').val(data.lt); $('#execution').val(data.execution); $('#login-form').submit(); },
		error:function(){ alert('网络访问错误!'); }
	});
};

var logincallback = function(result) {
	if (result.ret == 0) {
		location.href = "http://www.ssoclient.com:8080/demo-web/test/index.do";
	} else {
		alert(result.msg);
		$('#login-form')[0].reset();
	}
};
